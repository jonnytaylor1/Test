const express = require('express');
const mongoose = require('mongoose');
const { User} = require('../models/user+request');
const { Conversation, Message } = require('../models/conversation');
// const {Conversation, Message} = require('../Models/conversation');


const convoRouter = express.Router();

convoRouter.get('/', async (req, res,next)=>{
    try{
        let response = await Message.find({});
        res.send(response);
    }
    catch (err){
        next(err);
    }
})

convoRouter.get('/messages/:id', async (req, res,next)=>{
    try{
        let convoId = mongoose.Types.ObjectId(req.params.id); 
        let response = await Conversation.aggregate([
            {$match: { _id : convoId }},
            {$project: {messages: 1, _id: 0}}   
        ]);
        let messages = response[0].messages;
        res.status(200).send(messages);
    }
    catch (err){

    }
})

//The user type must either be helper (if they are on the map page) or
//requester (if they are on the requests page)

convoRouter.get('/:userType/:id', async (req, res,next)=>{
    try{
        let currentUserId = req.params.id;
        console.log(currentUserId);
        console.log(req.params.userType);
        let userId = mongoose.Types.ObjectId(currentUserId);
        let response = await Conversation.aggregate(
            [
                {$match: { [req.params.userType] : userId }},
                {$lookup: {
                        from: "users",
                        localField: "requester" ,
                        foreignField: "_id",
                        as: "user_data"}
                },
                {$project: {"user_data": 1} }
            ]
        )
        res.send(response);
    }
    catch (err){
        next(err);
    }
})




convoRouter.post('/', async(req, res,next)=>{
    try{
        let {helperId, requesterId} = req.body;
        let newConvo = new Conversation({helper: helperId, requester: requesterId, messages:[]});
        let response = await newConvo.save();
        res.status(201).send(response);
    }
    catch (err){
        next(err)
    }
})

convoRouter.put('/:id', async(req, res, next)=>{
    try{
        console.log(req.params.id);
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
        res.send(response);
    }
    catch(err){
        next(err)
    }
})



module.exports = convoRouter;