const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email already exsists'],
        match: [/^[a-z]{3,15}[0-9]{0,6}(@)(gmail\.com)$/, 'please enter a valid Email Address'],
        lowercase: [true, 'please enter a valid Email Address'],
        trim: true
    },

    fullName: {
        type: String,
        required: [true, 'Full Name is required'],
        match: [/^[a-zA-Z]{3,15}( )([a-zA-Z]{3,15}){1,3}$/, 'Name can only contain letters'],
        trim: true
    },

    password: {
        type: String,
        required: [true, 'password is required'],
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
        required: [true, 'Date of birth is required'],
    },
    about: String,
    userLocation: String,
    role: {
        type: String,
        enum:
        {
            values: ['user', 'admin'],
            message: 'Role must be either user or admin'
        },
        default: 'user',
    },
    isVerified: {
        type: Boolean,
        default: true
    }
    
},{timestamps:true});


module.exports= mongoose.model('User',userSchema)