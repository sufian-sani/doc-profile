
const db = require('../models');

exports.createDoctor = async (req, res) => {
    const { name, specialty } = req.body;
    try {
        const doctor = await db.Doctor.create({ name, specialty });
        res.status(201).json(doctor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
