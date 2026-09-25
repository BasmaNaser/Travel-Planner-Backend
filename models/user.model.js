const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email already exists'],
        match: [
            /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
            'please enter a valid Email Address'
        ],
        lowercase: true,
        trim: true
    },

    fullName: {
        type: String,
        required: [true, 'Full Name is required'],
        trim: true
    },

    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
        trim: true
    },

    
    phone: {
        type: String,
        required: [true, 'Phone Number is required'],
        unique: [true, 'Phone already Registered'],
        match: [/^(01)(1|2|0|5)[0-9]{8}$/, 'please enter a valid Phone Number'],
        trim: true
    },

    dob: {
        type: Date,
        required: [true, 'Date of birth is required']
    },

    about: String,

    gender: {
        type: String,
        enum: {
            values: ['Male', 'Female', 'Other'],
            message: 'Gender must be Male, Female, or Other'
        }
    },

    profilePicture: {
        type: String,
        default: ''
    },

    profilePicturePublicId: {
        type: String,
        default: ''
    },

    userLocation: String,

    role: {
        type: String,
        enum: {
            values: ['user', 'admin'],
            message: 'Role must be either user or admin'
        },
        default: 'user'
    },

    isVerified: {
        type: Boolean,
        default: true
    }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);