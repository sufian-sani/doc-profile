const db = require('../models');

exports.createSchedule = async (req, res) => {
    const { doctorId } = req.params;
    const { dayOfWeek, startTime, endTime } = req.body;

    try {
        const schedule = await db.Schedule.create({
            doctorId,
            dayOfWeek,
            startTime,
            endTime
        });
        res.status(201).json(schedule);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};