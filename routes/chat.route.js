const express = require('express');
const { body } = require('express-validator');
const authentication = require('../middlewares/authMiddleware');
const authorization = require('../middlewares/authorized');
const { validate } = require('../middlewares/validator');
const {
    sendMessageController,
    getMyConversationController,
    getAllConversationsController,
    getConversationMessagesController,
    replyToConversationController,
    getUnreadCountController
} = require('../controllers/chat.controller');

const chatRouter = express.Router();

const messageValidate = [
    body('text')
        .trim()
        .notEmpty().withMessage('Message text is required')
        .isLength({ max: 2000 }).withMessage('Message cannot exceed 2000 characters')
];

// ---------- اليوزر ----------
chatRouter.post('/messages', authentication, authorization('user'), messageValidate, validate, sendMessageController);
chatRouter.get('/my-conversation', authentication, authorization('user'), getMyConversationController);

// ---------- الأدمن ----------
chatRouter.get('/admin/unread-count', authentication, authorization('admin'), getUnreadCountController);
chatRouter.get('/admin/conversations', authentication, authorization('admin'), getAllConversationsController);
chatRouter.get('/admin/conversations/:id', authentication, authorization('admin'), getConversationMessagesController);
chatRouter.post('/admin/conversations/:id/reply', authentication, authorization('admin'), messageValidate, validate, replyToConversationController);

module.exports = chatRouter;