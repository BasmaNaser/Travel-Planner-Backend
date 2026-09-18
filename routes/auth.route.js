const express = require('express')
const authRouter= express.Router()
const {signupController,verifyOtpController,resendOtpController,loginController,refreshTokenController,forgetPasswordController,resetPasswordController,resetNewPasswordController,logoutController} = require('../controllers/auth.controller')
const authentication = require('../middlewares/authMiddleware')


authRouter.post('/signup',signupController)
authRouter.post('/verify-otp',verifyOtpController)
authRouter.post('/resend-otp',resendOtpController)
authRouter.post('/login',loginController)
authRouter.post('/refresh-token',refreshTokenController)
authRouter.post('/forget-password',forgetPasswordController)
authRouter.get('/reset-password/:token',resetPasswordController)
authRouter.patch('/reset-password/:token',resetNewPasswordController)
authRouter.post('/logout',authentication,logoutController)
module.exports = authRouter