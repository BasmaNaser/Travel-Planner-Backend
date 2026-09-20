const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required'],
        unique: true
    },

    lastMessage: {
        type: String,
        default: ''
    },

    lastMessageAt: {
        type: Date,
        default: Date.now
    },

    unreadByAdmin: {
        type: Number,
        default: 0
    },

    unreadByUser: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

conversationSchema.index({ lastMessageAt: -1 });

module.exports = mongoose.model('Conversation', conversationSchema);