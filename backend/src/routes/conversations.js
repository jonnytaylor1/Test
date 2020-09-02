const express = require('express');
const { Conversation, Message } = require('../models/conversation');


const convoRouter = express.Router();


//This is needed to gain additional information about the helper when a new conversation is created

convoRouter.get('/newConvo/:id', async (req, res,next)=>{
    try{
        let requesterId = req.params.id;
        await Conversation.find({requester: requesterId})
        .populate("helper", "_id, name")
        .exec(async function(err, convos){
            res.send(convos);
        })
    }
    catch (err) { next(err);};
})



//UserType is based on if they are on the map page(helper) or on the requests page (requester)
//If usertype is helper - Gets all of the conversations between the user and requesters they are helping
//If usertype is requester - Gets all of the conversations between the user and the helpers that are offering help
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
    catch (err) { next(err); };
})


//Creates a new conversation and returns the conversation with the requester information populated
convoRouter.post('/', async(req, res,next)=>{
    try{
        let {helperId, requesterId} = req.body;
        let convo = new Conversation({helper: helperId, requester: requesterId, messages:[]});
        let response = await convo.save().then(c=>c.populate('requester', "_id name requests").execPopulate());
        res.status(201).send(response);
    }
    catch (err) { next(err); };
})

//Adds a message to a conversation
convoRouter.put('/:id', async(req, res, next)=>{
    try{
        let convoId = req.params.id;
        let {receiverId, senderId, text} = req.body;
        let message = new Message({receiverId: receiverId, senderId: senderId, text: text});
        let response = await Conversation.findOneAndUpdate({_id: convoId}, {$push: {messages: message}}, {new: true, useFindAndModify: false});
        res.send(response)
    }
    catch (err) { next(err); };
})

//Deletes all the conversations of a specific user
convoRouter.delete('/many/:userId', async(req, res, next)=>{
    try{
        let userId = req.params.userId;
        let response = await Conversation.find({$or: [{requester: userId}, {helper: userId}]});
        await Conversation.deleteMany({$or: [{requester: userId}, {helper: userId}]});
        res.send(response);
    }
    catch (err) { next(err); };
})

//Deletes a conversation by conversation ID
convoRouter.delete('/:id', async(req, res,next)=>{
    try{
        let convoId = req.params.id; 
        let response = await Conversation.findByIdAndRemove(convoId, {useFindAndModify: false});
        res.send(response);
    }
    catch(err){
        next(err)
    }
})









module.exports = convoRouter;