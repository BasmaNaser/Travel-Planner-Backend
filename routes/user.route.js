const express = require('express')
const authentication = require('../middlewares/authMiddleware')
const authorization = require('../middlewares/authorized')
const userRouter = express.Router()
const {validate,contactValidate} = require('../middlewares/validator')
const {createContactController}=require('../controllers/user.controller')

userRouter.post('/contact/send',authentication,authorization('user'),contactValidate,validate,createContactController)


module.exports = userRouter