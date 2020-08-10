import express from 'express';
import User from '../models/user';
import bcrypt from 'bcryptjs';
import axios from 'axios';


const usersRouter = express.Router();


usersRouter.get('/nearby/:id/:long/:lat', async (req, res, next)=>{
  try{
    let {id, long, lat} = req.params;
    console.log(long, lat);

    let users = await User.find(
      {location: { $geoWithin: { $centerSphere: [ [ long, lat ], 5/3963.2 ] } } }

  ).where('requests')
  .ne([])
  .where('_id')
  .ne(id)
    res.status(200).json({
      message: "User successfully fetched",
      users: users
    })
  }
  catch (err){
    next(err);
  }

})


usersRouter.get('/:id', function(req, res, next) {
  try{
  User.findOne({_id: req.params.id}).then(user=>{
    if(user!==null){
      res.status(200).json({
        message: "User successfully fetched",
        user: user
      })
    }
  })
}
catch (err){
  next(err)
}
});

usersRouter.post('/', async (req, res, next)=>{
  try{
    const {email, password, name, postcode} = req.body;
    const existingEmail = await User.findOne({email: email});
    let response = await axios.get("https://api.postcodes.io/postcodes/"+postcode);
    let {longitude, latitude} = (response.data.result);
    if(!existingEmail){
        bcrypt.hash(password, 10, async (err, hash)=>{
          const user = new User({
          email: email,
          password: hash,
          name: name,
          location: {type: "Point", coordinates:[longitude, latitude]}
        });
        
        await user.save();

        res.status(201).send("Successful Registration, You Can Now Login");

        });    
  }
  else{
    res.status(409).send("Email Already Exists")
  }
}
catch (err){
  if(err.response.status===404){
    res.status(404).send("Invalid Postcode");
  }
  next(err);
}
});

usersRouter.delete('/:id', async (req, res, next)=>{
  try{
  await User.findByIdAndRemove(req.params.id, {useFindAndModify: false}, (err, user)=>{
    res.status(200).json({
      message: "User successfully fetched",
      user: user
    })
  })
}
catch (err){
  next(err)
}
})

usersRouter.put('/:id', async (req, res, next)=>{
  try{
    let {name, email, postcode} = req.body;
    const existingEmail = await User.find({email: email})
    .where('_id')
    .ne(req.params.id);
    if(existingEmail.length==0){
    let response = await axios.get("https://api.postcodes.io/postcodes/"+postcode);
    let {longitude, latitude} = (response.data.result);
    await User.findByIdAndUpdate(req.params.id, {email: email, name:name, location: {type: "Point", coordinates:[longitude, latitude]}}, {useFindAndModify: false}, (err, user)=>{
      res.status(200).json({
        message: "User successfully updated",
        user: user
      })
    });
  }
  else{
    res.status(409).send("Email Already Exists");
  }}
  catch (err){
    if(err.response.status===404){
      res.status(404).send("Invalid Postcode");
    }
    next(err);
  }

  }
)





export default usersRouter;