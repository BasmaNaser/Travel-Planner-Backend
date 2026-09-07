const express = require('express')
const authRouter= express.Router()
const {signupController,verifyOtpController,resendOtpController,loginController,refreshTokenController,forgetPasswordController,resetPasswordController,resetNewPasswordController} = require('../controllers/auth.controller')



authRouter.post('/signup',signupController)
authRouter.post('/verify-otp',verifyOtpController)
authRouter.post('/resend-otp',resendOtpController)
authRouter.post('/login',loginController)
authRouter.post('/refresh-token',refreshTokenController)
authRouter.post('/forget-password',forgetPasswordController)
authRouter.get('/reset-password/:token',resetPasswordController)
authRouter.patch('/reset-password/:token',resetNewPasswordController)
module.exports = authRouter