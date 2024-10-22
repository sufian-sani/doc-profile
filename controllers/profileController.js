// const User = require('../models/User');
// const Profile = require('../models/Profile');
// const { User, Profile } = require('../models');

// exports.createProfile = async (req, res) => {
//     const userId = req.user.id;
//     const { bio } = req.body;
//     try {
//         // Check if user exists
//         const user = await User.findByPk(userId);
//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }
//         // Create the profile
//         const profile = await Profile.create({ userId, bio });
//         res.status(201).json(profile);
//         // const profile = { userId: req.user.id };
//         // const user = await User.findOne({ userId: profile.id });
//         // res.status(201).json({
//         //     data: user
//         // });
//     } catch (error) {
//         res.status(500).json({ error: 'Error creating profile' });
//     }
// };
// const { Profile, User } = require('../models');
const db = require('../models');
// const multer = require('multer');
// Set storage engine
// const storage = multer.diskStorage({
//     destination: './uploads/',
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`);
//     },
// });
// Initialize upload
// const upload = multer({ storage });

// Create a profile for an existing user
exports.createProfile = async (req, res) => {
    const userId = req.user.id;
    const { bio } = req.body;
    let profilePicture = ''

    if (req.file) {
        profilePicture = req.file.filename; // Filename of the uploaded image
    }

    try {
        // Check if the user exists
        const user = await db.Users.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Ensure the user doesn't already have a profile
        const existingProfile = await db.Profiles.findOne({ where: { userId } });
        if (existingProfile) {
            return res.status(400).json({ error: 'Profile already exists for this user' });
        }
        // Initialize upload


            // Create the profile
        const profile = await db.Profiles.create({ userId, bio, profilePicture });
        res.status(201).json(profile);
    } catch (error) {
        console.error('Error creating profile:', error);
        res.status(500).json({ error: 'Failed to create profile' });
    }
};

// Update an existing profile
exports.updateProfile = async (req, res) => {
    const { userId } = req.params; // Extract userId from request parameters
    const { bio } = req.body; // Extract bio and location from request body

    try {
        // Find the profile for the given userId
        const profile = await db.Profiles.findOne({ where: { userId } });

        // Check if the profile exists
        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        // Update profile details
        await profile.update({ bio });

        // Return updated profile
        res.status(200).json(profile);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
};

// Update an existing user's name and bio
exports.updateUserAllParams = async (req, res) => {
    const userId = req.user.id; // Extract user ID from request parameters
    const { name, bio } = req.body; // Extract name and bio from request body
    let profilePicture = ''

    try {
        // Find the user by ID
        const user = await db.Users.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update user's name
        // user.name = name;
        // Update user's name if provided
        if (name !== undefined) {
            user.name = name;
        }
        if (req.file) {
            profilePicture = req.file.filename; // Filename of the uploaded image
        }

        // Update user's email if provided
        // if (email !== undefined) {
        //     user.email = email;
        // }
        await user.save(); // Save the changes

        // Find the profile associated with the user
        const profile = await db.Profiles.findOne({ where: { userId: userId } });
        if (!profile) {

            // Create the profile
            const profile = await db.Profiles.create({ userId, bio });
            return res.status(201).send({ profile });
        }


        // Update profile bio
        // profile.bio = bio;
        // Update profile bio if provided
        if (profilePicture !== undefined) {
            profile.profilePicture = profilePicture; // Update profile picture
        }
        if (bio !== undefined) {
            profile.bio = bio;
        }

        await profile.save(); // Save the changes

        // Return updated user and profile
        res.status(200).json({ user, profile });
    } catch (error) {
        console.error('Error updating user name and bio:', error);
        res.status(500).json({ error: 'Failed to update user name and bio' });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming req.user is set by your authentication middleware
        if(!userId) {
            res.status(501).json({ error: 'user not valid' });
        }
        // Find the profile associated with the user
        // const profile = await db.Profiles.findOne({
        //     where: { userId },
        //     include: [
        //         {
        //             model: db.Users,
        //             as: 'user', // Assuming you have the Users model associated
        //             attributes: ['name', 'email'], // Select the attributes you want to include
        //         },
        //     ],
        // });
        const profile = await db.Users.findOne({
            where: { id: userId },
            include: [
                {
                    model: db.Profiles,
                    as: 'profile',
                }
            ]
        })

        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }
        const response = {
            bio: profile?.profile?.bio,
            profilePicture: profile?.profile?.profilePicture,
            name: profile.name, // Assuming 'User' is the alias set by association
            email: profile.email,
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
};

