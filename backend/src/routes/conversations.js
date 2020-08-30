const express = require('express');
const mongoose = require('mongoose');
const { User} = require('../models/user+request');
const { Conversation, Message } = require('../models/conversation');
const conversationCopy = require('../models/conversationCopy');
// const {Conversation, Message} = require('../Models/conversation');


const convoRouter = express.Router();


//The user type must either be helper (if they are on the map page) or
//requester (if they are on the requests page)

convoRouter.get('/newConvo/:id', async (req, res,next)=>{
    try{
        let requesterId = req.params.id;
        await Conversation.find({requester: requesterId})
        .populate("helper", "_id, name")
        .exec(async function(err, convos){
            res.send(convos);
        })
    }
    catch (err){
        next(err);
    }
})

convoRouter.get('/copy/:id', async (req,res,next)=>{
    try{
        console.log("router");
        let convoId = req.params.id;
        let response = await conversationCopy.findOne({_id: convoId});
        console.log("router response: " + response);
        send(response);
    }
    catch (err){next(err);}
})





convoRouter.get('/:userType/:id', async (req, res,next)=>{
    try{
        let currentUserId = req.params.id;
        let otherUserType;
        if(req.params.userType === "helper") otherUserType="requester"
        else otherUserType = "helper"
        await Conversation.find({[req.params.userType]: currentUserId})
        .populate(otherUserType, "_id name requests")
        .exec(async function (err, convos){
            res.send(convos);
        })
    }
    catch (err){
        next(err);
    }
})






convoRouter.post('/', async(req, res,next)=>{
    try{
        let {helperId, requesterId} = req.body;
        let convo = new Conversation({helper: helperId, requester: requesterId, messages:[]});
        let response = await convo.save().then(c=>c.populate('requester', "_id name requests").execPopulate());
        res.status(201).send(response);
    }
    catch (err){
        next(err)
    }
})

convoRouter.put('/:id', async(req, res, next)=>{
    try{
        let convoId = req.params.id;
        let message = new Message(req.body);
        let response = await Conversation.findOneAndUpdate({_id: convoId}, {$push: {messages: message}}, {new: true, useFindAndModify: false});
        res.status(201).send(response)
    }
    catch (err){
        next(err)
    }
})

convoRouter.delete('/:id', async(req, res,next)=>{
    try{
        let convoId = req.params.id; 
        let response = await Conversation.findByIdAndRemove(convoId, {useFindAndModify: false});
        let {_id, helper, requester} = response;
        let newConvoCopy = new conversationCopy({_id: _id, helper: helper, requester: requester});
        await newConvoCopy.save();
        res.send(response);
    }
    catch(err){
        next(err)
    }
})



convoRouter.delete('/copy/:id', async(req, res,next)=>{
    try{
        let convoId = req.params.id;
        await conversationCopy.findByIdAndRemove(convoId, {useFindAndModify: false});
        res.send();
    }
    catch (err){next(err);}
})



module.exports = convoRouter;