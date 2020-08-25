const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new mongoose.Schema(
    {
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: String,
        created: {type: Date, default: Date.now}
    }
);



const ConversationSchema = new mongoose.Schema(
    {
        helper: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        messages: [MessageSchema]
    }
)

module.exports.Conversation = mongoose.model('Conversation', ConversationSchema);
module.exports.Message = mongoose.model('Message', MessageSchema);
