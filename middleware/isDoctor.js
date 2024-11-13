const db = require('../models');

module.exports = async (req, res, next) => {
    try {
        // Ensure user ID is available from `auth` middleware
        const userId = req.user?.id;
        if (!userId) {
            return res.status(403).json({ error: 'User ID missing, authorization denied' });
        }

        // Query the database to check the role
        const user = await db.Users.findOne({ where: { id: userId } });
        if (!user || user.role !== 'doctor') {
            return res.status(403).json({ error: 'Access denied. User is not a doctor.' });
        }

        next();  // User is a doctor, proceed to the next handler
    } catch (error) {
        res.status(500).json({ error: 'Role verification failed' });
    }
};
