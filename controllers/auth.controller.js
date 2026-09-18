const Apierror = require("../utils/apiError")
const generateOtp = require("../utils/generateOTP.JS")
const { hashedPass, comparedPasswords } = require("../utils/hashedPassword")
let User = require('../models/user.model')
let OTP = require('../models/otp.model')
const sendOtpEmail = require("../utils/sendOtpEmail")
const { accessTokenFun, refreshTokenFun, resetTokenFun } = require("../utils/createTokens")
const jwt = require("jsonwebtoken")
const sendResetPasswordEmail = require("../utils/sendResetPasswordEmail")
const passRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@%$&*^#])[a-zA-Z0-9@%$&*^#]{8,}$/
let signupController = async function (req, res, next) {
    try {
        const { email, fullName, password, phone, dob, role = 'user' } = req.body;
        if (!email || !fullName || !password || !phone || !dob) {
            return next(new Apierror('All Field Is Required', 400))
        }
        const emailExsistes = await User.findOne({ email })
        if (emailExsistes) {
            return next(new Apierror('Email already exists', 409))
        }
        const phoneExsists = await User.findOne({ phone })
        if (phoneExsists) {
            return next(new Apierror('Phone Number already exists', 409))
        }
        if (!passRegExp.test(password)) {
            return next(new Apierror('Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character', 400))
        }
        const allowedRoles = ['user', 'admin'];
        if (!allowedRoles.includes(role)) {
            return next(new Apierror('Invalid role. Allowed roles are: user, admin', 400));
        }
        const otp = generateOtp();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000)
        const hashedPassword = await hashedPass(password)
        await OTP.deleteMany({ email })
        const otpData = await OTP.create({ email, password: hashedPassword, phone, dob, fullName, role, otp, otpExpiresAt: expiresAt })
        const emailSended = await sendOtpEmail(otp, email)
        console.log(otpData);
        console.log(emailSended);


        res.status(201).json({ message: 'OTP sent successfully. Please verify your email.' })

    } catch (error) {
        next(error)
    }
}

let verifyOtpController = async function (req, res, next) {
    try {
        let { email, otp } = req.body
        if (!email || !otp) {
            return next(new Apierror('Email and OTP is required ', 400))
        }
        const otpData = await OTP.findOne({ email })
        if (!otpData) {
            return next(new Apierror('OTP not found or expired', 404))
        }
        if (otpData.otp !== otp) {
            return next(new Apierror('Invalid OTP', 400))
        }
        if (otpData.otpExpiresAt < new Date()) {
            return next(new Apierror('OTP has expired', 400))
        }
        const user = await User.create({
            email: otpData.email,
            fullName: otpData.fullName,
            password: otpData.password,
            phone: otpData.phone,
            dob: otpData.dob,
            role: otpData.role
        })
        await OTP.deleteMany({ email })
        res.status(200).json({
            message: 'Account Created Successfuly', data: {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                phone: user.phone,
                dob: user.dob,
                role: user.role
            }
        })

    } catch (error) {
        next(error)
    }
}

let resendOtpController = async function (req, res, next) {
    try {
        let { email } = req.body
        if (!email) {
            return next(new Apierror('Email is required', 400))
        }
        let otpData = await OTP.findOne({ email })
        if (!otpData) {
            return next(new Apierror('No signup request found for this email', 404))
        }
        const otp = generateOtp()
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000)
        otpData.otp = otp
        otpData.otpExpiresAt = expiresAt
        await otpData.save()
        const emailSend = await sendOtpEmail(otp, email)
        console.log(otp, emailSend);
        console.log(otpData);

        res.status(200).json({ message: 'OTP resent successfully. Please check your email.' })

    } catch (error) {
        next(error)
    }
}


let loginController = async function (req, res, next) {
    try {
        let { email, password } = req.body
        if (!email || !password) {
            return next(new Apierror('Email and password are required !', 400))
        }
        let user = await User.findOne({ email })
        if (!user) {
            return next(new Apierror('User Not Found', 404))

        }
        const passwordMatch = await comparedPasswords(password, user.password)
        if (!passwordMatch) {
            return next(new Apierror('Invalid email or password', 401))
        }
        const accessToken = accessTokenFun(user)
        const refreshToken = refreshTokenFun(user)
        res.cookie('refreshToken', refreshToken,
            {
                httpOnly: true
            }
        )
        res.status(200).json({
            message: 'Login successful', data: {
                accessToken,
                user: {
                    id: user._id,
                    email: user.email,
                    fullName: user.fullName,
                    role: user.role
                }
            }
        })

    } catch (error) {
        next(error)
    }
}

let refreshTokenController = async function (req, res, next) {
    try {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) {
            return next(new Apierror('Refresh token is required', 401))
        }
        let decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        let user = await User.findById(decode.id)
        if (!user) {
            return next(new Apierror('User Not Found', 404))
        }
        let accessToken = accessTokenFun(user)
        res.status(200).json({ message: 'Access token refreshed successfully', data: { accessToken } })

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return next(new Apierror('Refresh token has expired', 401))
        }

        if (error.name === 'JsonWebTokenError') {
            return next(new Apierror('Invalid refresh token', 401))
        }
        next(error)
    }
}

let forgetPasswordController = async function (req, res, next) {
    try {
        let { email } = req.body
        if (!email) {
            return next(new Apierror('Email is required', 400))
        }
        const user = await User.findOne({ email })
        if (!user) {
            return next(new Apierror('User Not Found', 404))
        }
        const resetToken = resetTokenFun(user)
        const resetLink = `http://localhost:5000/auth/reset-password/${resetToken}`
        let resetPasswordEmail = await sendResetPasswordEmail(user.email, resetLink)
        console.log(resetPasswordEmail);
        res.status(200).json({ message: 'Password reset link sent successfully. Please check your email.' })

    } catch (error) {
        next(error)
    }
}

let resetPasswordController = async function (req, res, next) {
    try {
        let { token } = req.params
        if (!token) {
            return next(new Apierror('Reset token is required', 400))
        }
        let decoded = jwt.verify(token, process.env.RESET_TOKEN_SECRET)
        const user = await User.findById(decoded.id)
        if (!user) {
            return next(new Apierror('UserNotFound', 404))
        }

        res.status(200).json({
            message: 'Reset token is valid', data: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return next(new Apierror('Reset token has expired', 401))
        }

        if (error.name === 'JsonWebTokenError') {
            return next(new Apierror('Invalid reset token', 401))
        }
        next(error)
    }
}

let resetNewPasswordController = async function (req, res, next) {
    try {
        let { token } = req.params
        if (!token) {
            return next(new Apierror('Reset token is required', 400))
        }
        let decoded = jwt.verify(token, process.env.RESET_TOKEN_SECRET)
        const user = await User.findById(decoded.id)
        if (!user) {
            return next(new Apierror('UserNotFound', 404))
        }
        let { newPassword, ConfirmedNewPassword } = req.body
        if (!newPassword || !ConfirmedNewPassword) {
            return next(new Apierror('New Password and Confirmed New Password is required', 400))
        }
        if (!passRegExp.test(newPassword)) {
            return next(new Apierror('Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character', 400))
        }
        if (newPassword !== ConfirmedNewPassword) {
            return next(new Apierror('Password dont match', 400))
        }
        const hashedPassword = await hashedPass(newPassword)
        user.password = hashedPassword
        await user.save()
        res.status(200).json({ message: 'Password Reset Successfuly' })
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return next(new Apierror('Reset token has expired', 401))
        }
        else if (error.name === 'JsonWebTokenError') {
            return next(new Apierror('Invalid reset token', 401))
        }
        next(error)
    }

}

let logoutController = async function (req, res, next) {
    try {

        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: 'No active session or user is already logged out'
            });
        }

        res.clearCookie('refreshToken',
            {
                httpOnly: true
            }
        )

        return res.status(200).json({
            success: true,
            message: 'Logout successful'
        });
    }
    catch (error) {
        next(error)
    }
}


module.exports = { signupController, verifyOtpController, resendOtpController, loginController, refreshTokenController, forgetPasswordController, resetPasswordController, resetNewPasswordController ,logoutController}