const express = require('express');
const {User} = require('../models/user+request');
const bcrypt = require('bcryptjs');
const axios = require('axios');


const usersRouter = express.Router();

//Returns all users that are within a 5 mile radius of the current user
usersRouter.get('/nearby/:id/:long/:lat', async (req, res, next)=>{
  try{
    let {id, long, lat} = req.params;
    let miles = 5;
    let users = await User.find({location: { $geoWithin: { $centerSphere: [ [ long, lat ], miles/3963.2 ] } } })
    .where('requests').ne([])
    .where('_id').ne(id)
    res.status(200).json({message: "Users successfully fetched", users: users})
  }
  catch (err) {next(err);}
})

//Returns the current user
usersRouter.get('/:id', async (req, res, next) => {
  try{
    let user = await User.findOne({_id: req.params.id});
    if(user!==null) res.status(200).json({message: "User successfully fetched", user: user})
  }
  catch (err){next(err)}
});

//Adds a new user to the database
//Converts the postcode to lat and long co-ordinates before saving
//Hashes the password before saving
usersRouter.post('/', async (req, res, next)=>{
  try{
    const {email, password, name, postcode} = req.body;
    const existingEmail = await User.findOne({email: email});
    let response = await axios.get("https://api.postcodes.io/postcodes/"+postcode);
    let {longitude, latitude} = (response.data.result);
    if(!existingEmail){
        bcrypt.hash(password, 10, async (err, hash)=>{
        const user = new User({email: email, password: hash, name: name, location: {type: "Point", coordinates:[longitude, latitude]}});
        await user.save();
        res.status(201).send("Successful Registration, You Can Now Login");
        });    
      }
    else res.status(409).send("Email Already Exists");
  }
  catch (err){
    if(err.response.status===404) res.status(404).send("Invalid Postcode");
    next(err);
  }
});

//Removes the current user from the database
usersRouter.delete('/:id', async (req, res, next)=>{
  try{
  await User.findByIdAndRemove(req.params.id, {useFindAndModify: false}, (err, user)=>{
    res.status(200).json({message: "User successfully fetched", user: user})
    })
  }
  catch (err){next(err)}
})

//Modifies the current user in the database
usersRouter.put('/:id', async (req, res, next)=>{
  try{
    let {name, email, postcode} = req.body;
    const existingEmail = await User.find({email: email}).where('_id').ne(req.params.id);
    if(existingEmail.length==0){
      let response = await axios.get("https://api.postcodes.io/postcodes/"+postcode);
      let {longitude, latitude} = (response.data.result);
      await User.findByIdAndUpdate(req.params.id, {email: email, name: name, location: {type: "Point", coordinates:[longitude, latitude]}}, {useFindAndModify: false}, 
      (err, user)=>{
        res.status(200).json({message: "User Successfully Updated", user: user})
      });
    }
    else res.status(409).send("Email Already Exists");
  }
  catch (err){
    if(err.response.status===404) res.status(404).send("Invalid Postcode");
    next(err);
  }
})

module.exports =  usersRouter;