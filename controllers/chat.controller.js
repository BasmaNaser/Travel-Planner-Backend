const mongoose = require('mongoose');
const Conversation = require('../models/conversation.model');
const ChatMessage = require('../models/chatMessage.model');
const Users = require('../models/user.model');
const Apierror = require('../utils/apiError');
const { getIO } = require('../utils/socket');

// أول 100 حرف من الرسالة تظهر في قائمة المحادثات
const preview = (text) => (text.length > 100 ? text.slice(0, 100) + '...' : text);

const checkObjectId = (id) => {
    if (!mongoose.isValidObjectId(id)) {
        throw new Apierror('Invalid conversation id', 400);
    }
};

// ===================== جهة اليوزر =====================

// اليوزر يبعت رسالة  ->  تتحفظ  ->  نوتيفيكيشن فوري لكل الأدمنز
let sendMessageController = async function (req, res, next) {
    try {
        const { text } = req.body;

        const user = await Users.findById(req.user.id).select('fullName email profilePicture');
        if (!user) {
            return next(new Apierror('User Not Found', 404));
        }

        // لو اليوزر ملوش محادثة نعملهاله، ولو عنده نجيبها
        let conversation = await Conversation.findOneAndUpdate(
            { user: user._id },
            { $setOnInsert: { user: user._id } },
            { upsert: true, new: true }
        );

        const message = await ChatMessage.create({
            conversation: conversation._id,
            sender: user._id,
            senderRole: 'user',
            text
        });

        conversation = await Conversation.findByIdAndUpdate(
            conversation._id,
            {
                $set: { lastMessage: preview(message.text), lastMessageAt: message.createdAt },
                $inc: { unreadByAdmin: 1 }
            },
            { new: true }
        );

        // نوتيفيكيشن للأدمنز (اللي متصلين دلوقتي)
        const io = getIO();
        io.to('admins').emit('notification:new', {
            conversationId: conversation._id,
            user: {
                id: user._id,
                fullName: user.fullName,
                profilePicture: user.profilePicture
            },
            lastMessage: conversation.lastMessage,
            unreadByAdmin: conversation.unreadByAdmin,
            createdAt: message.createdAt
        });
        io.to('admins').emit('message:new', message);

        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data: message
        });
    } catch (error) {
        next(error);
    }
};

// اليوزر يفتح محادثته ويشوف كل الرسايل
let getMyConversationController = async function (req, res, next) {
    try {
        const conversation = await Conversation.findOne({ user: req.user.id });

        if (!conversation) {
            return res.status(200).json({
                success: true,
                data: { conversation: null, messages: [] }
            });
        }

        const messages = await ChatMessage.find({ conversation: conversation._id }).sort({ createdAt: 1 });

        // اليوزر شاف ردود الأدمن، فنعلمها كمقروءة
        await ChatMessage.updateMany(
            { conversation: conversation._id, senderRole: 'admin', isRead: false },
            { $set: { isRead: true } }
        );
        if (conversation.unreadByUser > 0) {
            conversation.unreadByUser = 0;
            await conversation.save();
        }

        res.status(200).json({
            success: true,
            data: { conversation, messages }
        });
    } catch (error) {
        next(error);
    }
};

// ===================== جهة الأدمن =====================

// كل المحادثات، الأحدث فوق
let getAllConversationsController = async function (req, res, next) {
    try {
        const conversations = await Conversation.find()
            .populate('user', 'fullName email phone profilePicture')
            .sort({ lastMessageAt: -1 });

        res.status(200).json({
            success: true,
            count: conversations.length,
            data: conversations
        });
    } catch (error) {
        next(error);
    }
};

// رسايل محادثة معينة (وتتعلّم كمقروءة)
let getConversationMessagesController = async function (req, res, next) {
    try {
        const { id } = req.params;
        checkObjectId(id);

        const conversation = await Conversation.findById(id)
            .populate('user', 'fullName email phone profilePicture');
        if (!conversation) {
            return next(new Apierror('Conversation Not Found', 404));
        }

        const messages = await ChatMessage.find({ conversation: conversation._id }).sort({ createdAt: 1 });

        await ChatMessage.updateMany(
            { conversation: conversation._id, senderRole: 'user', isRead: false },
            { $set: { isRead: true } }
        );
        if (conversation.unreadByAdmin > 0) {
            conversation.unreadByAdmin = 0;
            await conversation.save();
        }

        // نبلّغ اليوزر إن رسايله اتقرت
        getIO().to(`user:${conversation.user._id}`).emit('message:read', {
            conversationId: conversation._id
        });

        res.status(200).json({
            success: true,
            data: { conversation, messages }
        });
    } catch (error) {
        next(error);
    }
};

// الأدمن يرد على يوزر  ->  الرد يوصل لليوزر فورًا
let replyToConversationController = async function (req, res, next) {
    try {
        const { id } = req.params;
        const { text } = req.body;
        checkObjectId(id);

        let conversation = await Conversation.findById(id);
        if (!conversation) {
            return next(new Apierror('Conversation Not Found', 404));
        }

        const message = await ChatMessage.create({
            conversation: conversation._id,
            sender: req.user.id,
            senderRole: 'admin',
            text
        });

        conversation = await Conversation.findByIdAndUpdate(
            conversation._id,
            {
                $set: { lastMessage: preview(message.text), lastMessageAt: message.createdAt },
                $inc: { unreadByUser: 1 }
            },
            { new: true }
        );

        const io = getIO();
        io.to(`user:${conversation.user}`).emit('message:new', message);
        io.to('admins').emit('message:new', message); // عشان باقي الأدمنز يشوفوا الرد

        res.status(201).json({
            success: true,
            message: 'Reply sent successfully',
            data: message
        });
    } catch (error) {
        next(error);
    }
};

// عدّاد النوتيفيكيشن (الرقم الأحمر) للأدمن
let getUnreadCountController = async function (req, res, next) {
    try {
        const result = await Conversation.aggregate([
            {
                $group: {
                    _id: null,
                    totalUnread: { $sum: '$unreadByAdmin' },
                    conversationsWithUnread: {
                        $sum: { $cond: [{ $gt: ['$unreadByAdmin', 0] }, 1, 0] }
                    }
                }
            }
        ]);

        const { totalUnread = 0, conversationsWithUnread = 0 } = result[0] || {};

        res.status(200).json({
            success: true,
            data: { totalUnread, conversationsWithUnread }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    sendMessageController,
    getMyConversationController,
    getAllConversationsController,
    getConversationMessagesController,
    replyToConversationController,
    getUnreadCountController
};