const express = require('express');
const multer = require('multer');
const { createProfile, updateProfile, updateUserAllParams, getProfile } = require('../controllers/profileController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();
const path = require('path');

// Configure multer for file uploads
const imageStorage = multer.diskStorage({
    destination: 'images',  // Ensure 'images' directory exists
    filename: (req, file, cb) => {
        const uniqueName = `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const imageUpload = multer({
    storage: imageStorage,
    limits: { fileSize: 1000000 }, // 1 MB limit
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
            return cb(new Error('Only .png, .jpg, and .jpeg format allowed!'));
        }
        cb(null, true);
    }
});

// const upload = multer({ storage });

router.get('/', authMiddleware, getProfile);
router.post('/', authMiddleware,imageUpload.single('image'), createProfile);
// router.put('/:userId',authMiddleware, updateProfile);  // Route to update a profile
router.put('/', authMiddleware, imageUpload.single('image'), updateUserAllParams);  // Route to update a profile

module.exports = router;
