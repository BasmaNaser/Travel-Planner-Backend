const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'user_profiles', // اسم المجلد داخل Cloudinary
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        
        public_id: (req, file) => {
            const fileNameWithoutExt = path.parse(file.originalname).name;
            
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            
            return `user-${req.user?.id || 'guest'}-${fileNameWithoutExt}-${uniqueSuffix}`;
        },
    },
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 } // حد أقصى 2 ميجابايت
});

module.exports = { upload, cloudinary };