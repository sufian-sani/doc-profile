const express = require('express');
const { createProfile, updateProfile,updateUserAllParams } = require('../controllers/profileController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.post('/', authMiddleware, createProfile);
// router.put('/:userId',authMiddleware, updateProfile);  // Route to update a profile
router.put('/:userId',authMiddleware, updateUserAllParams);  // Route to update a profile

module.exports = router;
