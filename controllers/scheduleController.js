// controllers/scheduleController.js
const db = require('../models');


// Controller to get all doctors
exports.getDoctors = async (req, res) => {
    try {
        // Fetch all users with the role 'doctor'
        const doctors = await db.Users.findAll({
            where: {
                role: 'doctor',
            },
            attributes: ['id', 'name', 'email', 'role'], // Specify the fields you want to return
        });

        if (!doctors.length) {
            return res.status(404).json({ message: 'No doctors found.' });
        }

        res.status(200).json(doctors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch doctors.', error });
    }
};

exports.createSchedule = async (req, res) => {
    const { doctorId, date, startTime, endTime } = req.body;

    try {
        // Verify that the user is a doctor
        const doctor = await db.Users.findOne({ where: { id: doctorId, role: 'doctor' } });
        if (!doctor) {
            return res.status(403).json({ error: 'Only doctors can create schedules.' });
        }

        // Create the schedule
        const schedule = await db.Schedule.create({
            doctorId,
            date,
            startTime,
            endTime
        });

        res.status(201).json({ message: 'Schedule created successfully', schedule });
    } catch (error) {
        console.error('Error creating schedule:', error);
        res.status(500).json({ error: 'Failed to create schedule' });
    }
};

exports.getAvailableSchedules = async (req, res) => {
    const { doctorId } = req.params;

    try {
        const schedules = await db.Schedule.findAll({
            where: { doctorId },
            include: [{
                model: db.Users,
                as: 'doctor',
                attributes: ['name'],
            }],
        });

        if (!schedules.length) {
            return res.status(404).json({ message: 'No schedules found for this doctor.' });
        }

        res.json(schedules);
    } catch (error) {
        // console.log(error)
        res.status(500).json({ error: 'Failed to fetch schedules.' });
    }
};

const { Appointment, Schedule, Users } = require('../models');

// Controller to create an appointment
exports.createAppointment = async (req, res) => {
    const { patientId, scheduleId } = req.body;

    try {
        // Check if the schedule exists
        const schedule = await db.Schedule.findByPk(scheduleId);
        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        // Check if the patient exists
        const patient = await db.Users.findByPk(patientId);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        // Create the appointment
        const appointment = await Appointment.create({
            patientId,
            scheduleId,
            status: 'booked', // Default status can be 'booked'
        });

        return res.status(201).json(appointment);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to create appointment', error });
    }
};

// Controller to get a doctor by ID
exports.getDoctorById = async (req, res) => {
    const { id } = req.params;
    try {
        const doctor = await db.Users.findOne({
            where: { id, role: 'doctor' }, // Find doctor by ID
            attributes: ['id', 'name', 'email','role'], // Adjust based on your model
        });

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        res.json(doctor);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch doctor details.' });
    }
};

