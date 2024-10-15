const express = require('express');
const { createProfile, updateProfile, updateUserAllParams, getProfile } = require('../controllers/profileController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.get('/', authMiddleware, getProfile);
router.post('/', authMiddleware, createProfile);
// router.put('/:userId',authMiddleware, updateProfile);  // Route to update a profile
router.put('/', authMiddleware, updateUserAllParams);  // Route to update a profile

module.exports = router;
