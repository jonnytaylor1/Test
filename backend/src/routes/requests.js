const express = require('express');
const {Request, User} = require('../models/user+request');

const requestsRouter = express.Router();

//Returns the requests array in the User collection
requestsRouter.get('/:userId', async (req, res) => {
  try{
    let response = await User.findOne({_id: req.params.userId});
    let {requests} = response;
    res.send(requests);
  }
  catch (err) {res.send(err)}
});

  //Adds a request from the requests array in the User collection
requestsRouter.post('/', async (req, res, next)=>{
    try{
      const {title, details, user_id} = req.body;
      let newRequest = new Request({title: title, details: details})
      await User.findOneAndUpdate({_id: user_id}, {$push: {requests: newRequest}}, {new: true, useFindAndModify: false})
      res.status(201).json({status: "success", statusCode: 201, message: "Request Saved", request: newRequest});
    }
    catch (err){next(err);}
  });

  //Removes a request from the requests array in the User collection
  requestsRouter.put('/request', async (req, res, next) => {
    try{
      const {userId, requestId} = await req.body;
      await User.findOneAndUpdate({_id: userId}, {$pull: {requests: {_id: requestId}}}, {useFindAndModify:false});
      res.json({status: "success", statusCode: 200, message: "Request Deleted"});
      }
    catch (err) {next(err)}
  });

  //Updates a request from the requests array in the User collection
  requestsRouter.put('/', async (req, res, next) => {
    try{
    const {_id, title, details, user_id} = req.body;
    await User.findOneAndUpdate({"_id": user_id, "requests._id": _id}, {$set : { "requests.$.title" : title, "requests.$.details": details }},{useFindAndModify:false});
    res.json({status: "success", statusCode: 200, message: "Request Updated"});
    }
    catch (err) {next(err)}
  });

 



//https://medium.com/@fullsour/when-should-you-use-path-variable-and-query-parameter-a346790e8a6d
//Using param instead of query


  module.exports =  requestsRouter;