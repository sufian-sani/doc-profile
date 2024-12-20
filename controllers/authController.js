// const User = require('../models/User');
const db = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register user
exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        // If no role is provided, default to 'patient'
        const userRole = role || 'patient';

        // Ensure that the role is valid if provided
        const validRoles = ['patient', 'doctor', 'staff'];
        if (role && !validRoles.includes(role)) {
            return res.status(400).json({ message: 'Invalid role specified' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await db.Users.create({ name, email, password: hashedPassword, userRole });
        user.save()
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Registration failed' });
    }
};

// Login user
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await db.Users.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
};
