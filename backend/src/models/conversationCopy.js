const mongoose = require('mongoose');

const ConversationCopySchema = new mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        helper: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    }
)

module.exports = mongoose.model('ConversationCopy', ConversationCopySchema);