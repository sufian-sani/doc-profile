// controllers/scheduleController.js
const db = require('../models');
const moment = require('moment');
const { Op, literal } = require('sequelize');


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

//create doctor schedule
exports.createDoctorSchedule = async (req, res) => {
    const { doctorId } = req.params;
    const { date, startTime, endTime } = req.body;

    try {
        const schedule = await db.Schedule.create({
            doctorId,
            date,
            startTime,
            endTime,
        });

        res.status(201).json({ message: 'Schedule created successfully', schedule });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create schedule', error });
    }
};

// show doctor slot
exports.getAvailableSlots = async (req, res) => {
    const { doctorId, date } = req.params;
    let scheduleIdGet;

    try {
        // Step 1: Find the doctor's schedule for the given date
        const schedule = await db.Schedule.findAll({
            where: {
                doctorId: doctorId,
                date: moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD'), // Ensure the date is correctly formatted
            },
        });


        schedule.forEach(scheduleItem => {
            scheduleIdGet = scheduleItem.id
        });

        // console.log(scheduleIdGet)

        if (!schedule.length) {
            return res.status(404).json({ message: 'No schedule found for this doctor on this date.' });
        }

        // Step 2: Get existing appointments for the doctor on the same date
        const existingAppointments = await db.Appointment.findAll({
            where: {
                doctorId,
                [Op.and]: [
                    { startTime: { [Op.like]: `%${moment(date).format('YYYY-MM-DD')}%` } },  // Ensure the date is correctly formatted
                ],
            },
        });

        // Step 3: Prepare the list of available slots
        const availableSlots = [];

        // Iterate over each schedule to get the time slots
        for (const slot of schedule) {
            const startTime = moment(`${date}T${slot.startTime}`, moment.ISO_8601);
            const endTime = moment(`${date}T${slot.endTime}`, moment.ISO_8601);

            let currentSlotStart = moment(startTime);

            // Generate 30-minute slots
            while (currentSlotStart.isBefore(endTime)) {
                const currentSlotEnd = moment(currentSlotStart).add(30, 'minutes');

                // Check if the current slot is already booked
                const isBooked = existingAppointments.some((appointment) => {
                    const appointmentStart = moment(appointment.startTime, moment.ISO_8601);
                    const appointmentEnd = moment(appointment.endTime, moment.ISO_8601);

                    // Check if the current slot overlaps with any existing appointment
                    return (
                        currentSlotStart.isBetween(appointmentStart, appointmentEnd, undefined, '[)') ||
                        currentSlotEnd.isBetween(appointmentStart, appointmentEnd, undefined, '(]')
                    );
                });

                // If the slot is not booked, add it to available slots
                if (!isBooked) {
                    availableSlots.push({
                        startTime: currentSlotStart.format('HH:mm'),
                        endTime: currentSlotEnd.format('HH:mm'),
                        formattedSlot: `${currentSlotStart.format('HH:mm')}-${currentSlotEnd.format('HH:mm')}`
                    });
                }

                // Increment the start time by 30 minutes
                currentSlotStart.add(30, 'minutes');
            }
        }

        // Step 4: Return available slots
        res.json({availableSlots, scheduleIdGet});

    } catch (error) {
        console.error('Error fetching available slots:', error);
        res.status(500).json({ message: 'Error fetching available slots.', error });
    }
};

// Book a slot for a specific doctor

exports.bookSlot = async (req, res) => {
    const { doctorId, scheduleId } = req.params;
    const { patientId, startTime, endTime } = req.body;

    try {
        // Step 1: Check if the schedule exists for the doctor
        const schedule = await db.Schedule.findOne({
            where: {
                id: scheduleId,
                doctorId: doctorId,
            }
        });

        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found for this doctor.' });
        }

        // Step 2: Ensure the selected time is within the doctor's available schedule
        const scheduleStartTime = moment(`${schedule.date}T${schedule.startTime}`, 'YYYY-MM-DDTHH:mm');
        const scheduleEndTime = moment(`${schedule.date}T${schedule.endTime}`, 'YYYY-MM-DDTHH:mm');
        const appointmentStart = moment(startTime, 'YYYY-MM-DDTHH:mm').local();
        const appointmentEnd = moment(endTime, 'YYYY-MM-DDTHH:mm').local();

        // Ensure the appointment slot is exactly 30 minutes
        if (appointmentEnd.diff(appointmentStart, 'minutes') !== 30) {
            return res.status(400).json({ message: 'Appointment slot must be exactly 30 minutes.' });
        }

        // Check if appointment time is within the schedule's time
        if (appointmentStart.isBefore(scheduleStartTime) || appointmentEnd.isAfter(scheduleEndTime)) {
            return res.status(400).json({ message: 'Selected time is outside the doctor\'s available schedule.' });
        }

        // Step 3: Check for overlapping appointments
        const existingAppointment = await db.Appointment.findOne({
            where: {
                scheduleId,
                [Op.or]: [
                    {
                        startTime: { [Op.between]: [startTime, endTime] },
                    },
                    {
                        endTime: { [Op.between]: [startTime, endTime] },
                    },
                    {
                        [Op.and]: [
                            { startTime: { [Op.lte]: startTime } },
                            { endTime: { [Op.gte]: endTime } },
                        ],
                    },
                ],
            },
        });

        if (existingAppointment) {
            return res.status(409).json({ message: 'The selected time slot is already booked.' });
        }

        // Step 4: Book the slot
        const newAppointment = await db.Appointment.create({
            patientId,
            doctorId,
            scheduleId,
            startTime: appointmentStart.toISOString(true),
            endTime: appointmentEnd.toISOString(true),
            status: 'booked',
        });

        res.status(201).json({
            message: 'Appointment successfully booked',
            appointment: newAppointment,
        });

    } catch (error) {
        console.error('Error booking the appointment:', error);
        res.status(500).json({ message: 'Error booking the appointment', error });
    }
};





