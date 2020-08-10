import express from "express";
import User from "../models/user";
import bcrpt from 'bcryptjs';

const sessionRouter = express.Router();

//Adds a new user session to the database (using connect-mongo in the server)
//Returns the user Id to the client
sessionRouter.post("", async (req, res, next) => {
  try{
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    let auth;
    if(user) auth = await bcrpt.compare(password, user.password);
    if(user && auth){
      const sessionUser = { userId: user._id };
       req.session.user = sessionUser;         
       res.send({user: sessionUser, message: "Successful Login!"});
      }
    else res.status(404).send("Invalid Credentials!")
  }
  catch (err){next(err)}
});

//Deletes the user session from the database
sessionRouter.delete("", ({ session }, res, next) => {
  try {
    let user = session.user;
    if (user) {
      session.destroy((err) => {
        if (err) throw (err);
        res.clearCookie(process.env.SESS_NAME);
        res.send();
      });
    } 
    else  res.send(); //To avoid errors if the user clicks logout and the session has expired
  } 
  catch (err) {next(err)}
});

//Gets the user session from the database (using connect-mongo in server)
sessionRouter.get("", (req, res) => {
  if(req.session.user){
    res.send(req.session.user);
  }
  else{
    res.send();
  }
});

export default sessionRouter;
