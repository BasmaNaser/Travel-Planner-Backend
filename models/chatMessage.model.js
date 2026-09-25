const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: [true, 'Conversation is required']
    },

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Sender is required']
    },

    senderRole: {
        type: String,
        enum: {
            values: ['user', 'admin'],
            message: 'Sender role must be either user or admin'
        },
        required: true
    },

    text: {
        type: String,
        required: [true, 'Message text is required'],
        trim: true,
        maxlength: [2000, 'Message cannot exceed 2000 characters']
    },

    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// عشان نجيب رسايل محادثة معينة مترتبة بسرعة
chatMessageSchema.index({ conversation: 1, createdAt: 1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);