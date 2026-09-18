const Users = require('../models/user.model');
const Complaint = require('../models/complaint.model');
const bcryptjs = require('bcryptjs');
const Apierror = require('../utils/apiError');
const { cloudinary } = require('../utils/multer');
require('dotenv').config();

let createContactController = async function (req, res, next) {
    try {
        const { fullName, email, subject, message } = req.body;

        let user = await Users.findById(req.user.id);
        if (!user) {
            return next(new Apierror('User Not Found', 404));
        }

        const newMessage = await Complaint.create({
            userId: user._id,
            fullName,
            email,
            subject,
            message
        });

        res.status(201).json({
            success: true,
            message: "Your message has been sent successfully!",
            data: newMessage,
        });
    } catch (error) {
        next(error);
    }
};

let getMyContactController = async function (req, res, next) {
    try {
        let user = await Users.findById(req.user.id);
        if (!user) {
            return next(new Apierror('User Not Found', 404));
        }

        const myComplaints = await Complaint.find({ userId: user._id })
            .populate("userId", "fullName email phone")
            .sort({ createdAt: -1 });
        if(myComplaints.length==0){
            return next(new Apierror('Complaints Not Found',400))
        }
        res.status(200).json({
            success: true,
            count: myComplaints.length,
            data: myComplaints,
        });
    } catch (error) {
        next(error);
    }
};

let deleteAccountController = async function (req, res, next) {
    try {
        let user = await Users.findById(req.user.id);
        if (!user) {
            return next(new Apierror('User Not Found', 404));
        }
        if (req.cookies?.refreshToken) {
            res.clearCookie('refreshToken', {
                httpOnly: true,
            });
        }

        let deletedUser = await Users.findByIdAndDelete(user._id);
        await Complaint.deleteMany({ userId: user._id });

        res.status(200).json({
            success: true,
            message: 'Account Deleted Successfully',
            data: deletedUser
        });
    } catch (error) {
        next(error);
    }
};

let getUserProfileController = async function (req, res, next) {
    try {
        let user = await Users.findById(req.user.id).select('-password');
        if (!user) {
            return next(new Apierror('User Not Found', 404));
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

let updateUserDataController = async function (req, res, next) {
    try {
        const { fullName, gender, about, userLocation, dob } = req.body;

        const updateFields = {};

        if (fullName !== undefined) updateFields.fullName = fullName;
        if (gender !== undefined) updateFields.gender = gender;
        if (about !== undefined) updateFields.about = about;
        if (userLocation !== undefined) updateFields.userLocation = userLocation;
        if (dob !== undefined) updateFields.dob = dob;

        const updatedUser = await Users.findByIdAndUpdate(
            req.user.id,
            { $set: updateFields },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return next(new Apierror('User not found', 404));
        }

        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedUser
        });
    } catch (error) {
        next(error);
    }
};

let updateUserPasswordController = async function (req, res, next) {
    try {
        let { currentPassword, newPassword } = req.body;

        const user = await Users.findById(req.user.id);
        if (!user) {
            return next(new Apierror('User Not Found', 404));
        }

        const isMatch = await bcryptjs.compare(currentPassword, user.password);
        if (!isMatch) {
            return next(new Apierror('Current password is incorrect', 400));
        }

        let salt = await bcryptjs.genSalt(Number(process.env.SALT) || 10);
        user.password = await bcryptjs.hash(newPassword, salt);
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        next(error);
    }
};

let updateProfilePictureController = async function (req, res, next) {
    try {
        if (!req.file) {
            return next(new Apierror('Please upload an image file', 400));
        }

        const user = await Users.findById(req.user.id);
        if (!user) {
            return next(new Apierror('User Not Found', 404));
        }

        if (user.profilePicturePublicId) {
            await cloudinary.uploader.destroy(user.profilePicturePublicId);
        }

        user.profilePicture = req.file.path; 
        user.profilePicturePublicId = req.file.filename; 
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile picture updated successfully',
            data: {
                profilePicture: user.profilePicture
            }
        });
    } catch (error) {
        next(error);
    }
};
let deleteProfilePictureController = async function (req, res, next) {
    try {
        const user = await Users.findById(req.user.id);
        if (!user) {
            return next(new Apierror('User Not Found', 404));
        }

        if (!user.profilePicturePublicId) {
            return next(new Apierror('No profile picture to delete', 400));
        }

        await cloudinary.uploader.destroy(user.profilePicturePublicId);

        user.profilePicture = undefined;
        user.profilePicturePublicId = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile picture deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createContactController,
    getMyContactController,
    deleteAccountController,
    getUserProfileController,
    updateUserDataController,
    updateUserPasswordController,
    updateProfilePictureController, 
    deleteProfilePictureController
};