const db = require('../models');

function generateTimeSlots(startTime, endTime, interval = 30) {
    const slots = [];
    let start = new Date(`1970-01-01T${startTime}:00Z`);
    const end = new Date(`1970-01-01T${endTime}:00Z`);

    while (start < end) {
        slots.push(start.toISOString().slice(11, 16));
        start.setMinutes(start.getMinutes() + interval);
    }

    return slots;
}

exports.getAvailability = async (req, res) => {
    const { doctorId } = req.params;
    const { dayOfWeek, date } = req.query;

    try {
        const schedule = await db.Schedule.findOne({ where: { doctorId, dayOfWeek } });
        if (!schedule) return res.status(404).json({ message: 'No schedule available' });

        const allSlots = generateTimeSlots(schedule.startTime, schedule.endTime);
        const bookedSlots = await Appointment.findAll({
            where: { doctorId, date },
            attributes: ['time']
        });

        const bookedTimes = bookedSlots.map((a) => a.time);
        const availableSlots = allSlots.filter((slot) => !bookedTimes.includes(slot));

        res.json({ availableSlots });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.bookAppointment = async (req, res) => {
    const { doctorId, date, time, patientName } = req.body;

    try {
        const existing = await db.Appointment.findOne({ where: { doctorId, date, time } });
        if (existing) return res.status(400).json({ message: 'Time slot already booked' });

        const appointment = await db.Appointment.create({ doctorId, date, time, patientName });
        res.status(201).json(appointment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
