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

// exports.getAvailableSchedules = async (req, res) => {
//     const { doctorId } = req.params;
//
//     try {
//         const schedules = await db.Schedule.findAll({
//             where: { doctorId },
//             include: [{
//                 model: db.Users,
//                 as: 'doctor',
//                 attributes: ['name'],
//             }],
//         });
//
//         if (!schedules.length) {
//             return res.status(404).json({ message: 'No schedules found for this doctor.' });
//         }
//
//         res.json(schedules);
//     } catch (error) {
//         // console.log(error)
//         res.status(500).json({ error: 'Failed to fetch schedules.' });
//     }
// };

// Controller to create an appointment
// exports.createAppointment = async (req, res) => {
//     const { patientId, scheduleId } = req.body;
//
//     try {
//         // Check if the schedule exists
//         const schedule = await db.Schedule.findByPk(scheduleId);
//         if (!schedule) {
//             return res.status(404).json({ message: 'Schedule not found' });
//         }
//
//         // Check if the patient exists
//         const patient = await db.Users.findByPk(patientId);
//         if (!patient) {
//             return res.status(404).json({ message: 'Patient not found' });
//         }
//
//         // Create the appointment
//         const appointment = await Appointment.create({
//             patientId,
//             scheduleId,
//             status: 'booked', // Default status can be 'booked'
//         });
//
//         return res.status(201).json(appointment);
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: 'Failed to create appointment', error });
//     }
// };

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

// Function to generate 30-minute time slots
// exports.getAvailableSlots = async (req, res) => {
//     const { doctorId, date } = req.params; // doctorId and date passed as parameters
//
//     try {
//         // Fetch the doctor's schedule for the given date
//         const schedule = await db.Schedule.findOne({
//             where: {
//                 doctorId,
//                 date: date, // Match the exact date
//             }
//         });
//
//         if (!schedule) {
//             return res.status(404).json({ message: 'No schedule found for this doctor on this date.' });
//         }
//
//         // Generate 30-minute slots based on the schedule
//         const slots = generateSlots(schedule.startTime, schedule.endTime);
//
//         // Check if any slots are already booked
//         const bookedAppointments = await db.Appointment.findAll({
//             where: {
//                 scheduleId: schedule.id,
//             }
//         });
//
//         // Remove booked slots from available slots
//         const bookedSlotTimes = bookedAppointments.map(app => app.scheduleId);
//         const availableSlots = slots.filter(slot => !bookedSlotTimes.includes(slot));
//
//         res.json({ availableSlots });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching schedule slots.' });
//     }
// };

// Get available slots for a specific doctor on a given date
exports.getAvailableSlots = async (req, res) => {
    const { doctorId, date } = req.params;

    try {
        // Find the doctor's schedule for the given date
        const schedule = await db.Schedule.findAll({
            where: {
                doctorId: doctorId,
                date: date,  // Match the date
            },
            include: [{
                model: db.Appointment,
                as: 'appointment',
                where: {
                    status: 'booked', // Only check booked appointments for conflict
                    [Op.or]: [
                        { startTime: { [Op.gte]: literal("DATETIME('now')") } } // Filters appointments with startTime in the future
                    ]
                },
                required: false  // Include even if no appointment exists
            }]
        });

        // If no schedule found for the doctor on this date, return an error
        if (!schedule.length) {
            return res.status(404).json({ message: 'No schedule found for this doctor on this date.' });
        }

        // Process the schedule and find available time slots
        const availableSlots = schedule.map((slot) => {
            const existingAppointments = slot.appointment;

            // Create the time slot range for the doctor
            let slots = [];
            let startTime = new Date(`${date}T${slot.startTime}`);
            let endTime = new Date(`${date}T${slot.endTime}`);

            // Iterate through the time range and check for availability
            while (startTime < endTime) {
                let slotAvailable = true;
                existingAppointments.forEach((appointment) => {
                    const appointmentStart = new Date(appointment.startTime);
                    const appointmentEnd = new Date(appointment.endTime);
                    if (startTime >= appointmentStart && startTime < appointmentEnd) {
                        slotAvailable = false;
                    }
                });

                if (slotAvailable) {
                    slots.push({
                        startTime: startTime.toISOString(),
                        endTime: new Date(startTime.getTime() + 30 * 60000).toISOString(), // Adding 30 minutes
                    });
                }

                startTime = new Date(startTime.getTime() + 30 * 60000); // Increment by 30 minutes
            }

            return {
                date: slot.date,
                doctorId: slot.doctorId,
                availableSlots: slots,
            };
        });

        // Return available slots
        res.json(availableSlots);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch available slots.' });
    }
};

// Helper function to generate 30-minute time slots
// function generateSlots(startTime, endTime) {
//     const slots = [];
//     let currentStartTime = moment(startTime, 'HH:mm');
//     const endTimeMoment = moment(endTime, 'HH:mm');
//
//     while (currentStartTime.isBefore(endTimeMoment)) {
//         const currentEndTime = moment(currentStartTime).add(30, 'minutes');
//
//         slots.push({
//             startTime: currentStartTime.format('HH:mm'),
//             endTime: currentEndTime.format('HH:mm')
//         });
//
//         currentStartTime = currentEndTime;
//     }
//
//     return slots;
// }


// exports.bookAppointment = async (req, res) => {
//     const { patientId, doctorId, scheduleId, startTime, endTime, remarks } = req.body;
//
//     try {
//         // Validate that patient and doctor exist
//         const patient = await db.Users.findByPk(patientId);
//         if (!patient || patient.role !== 'patient') {
//             return res.status(400).json({ error: 'Patient not found or invalid role' });
//         }
//
//         const doctor = await db.Users.findByPk(doctorId);
//         if (!doctor || doctor.role !== 'doctor') {
//             return res.status(400).json({ error: 'Doctor not found or invalid role' });
//         }
//
//         // Validate that the schedule exists and belongs to the doctor
//         const schedule = await db.Schedule.findByPk(scheduleId);
//         if (!schedule || schedule.doctorId !== doctorId) {
//             return res.status(400).json({ error: 'Invalid schedule for this doctor' });
//         }
//
//         // Check if the requested time slot is available
//         // We check for conflicts where the appointment's start time or end time overlaps
//         const conflictingAppointments = await db.Appointment.findAll({
//             where: {
//                 scheduleId,
//                 status: 'booked',
//                 [Op.or]: [
//                     {
//                         startTime: {
//                             [Op.lte]: endTime, // New appointment starts before or when an existing one ends
//                         },
//                     },
//                     {
//                         endTime: {
//                             [Op.gte]: startTime, // New appointment ends after or when an existing one starts
//                         },
//                     },
//                 ],
//             },
//         });
//
//         if (conflictingAppointments.length > 0) {
//             return res.status(400).json({ error: 'The selected time slot is already booked.' });
//         }
//
//         // Create the new appointment if no conflicts
//         const appointment = await Appointment.create({
//             patientId,
//             doctorId,
//             scheduleId,
//             startTime,
//             endTime,
//             status: 'booked',
//             remarks,
//         });
//
//         res.status(201).json({ message: 'Appointment booked successfully', appointment });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Failed to book appointment' });
//     }
// };

// ---------------------
exports.bookAppointment = async (req, res) => {
    const { doctorId, scheduleId } = req.params;
    const { patientId, startTime, endTime } = req.body; // Assuming patientId and times are sent in the request body

    try {
        // Check if the schedule exists and belongs to the specified doctor
        const schedule = await db.Schedule.findOne({
            where: { id: scheduleId, doctorId },
        });

        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found for this doctor.' });
        }

        // Check if the selected time slot is already booked
        const overlappingAppointments = await db.Appointment.findOne({
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

        if (overlappingAppointments) {
            return res.status(409).json({ message: 'The selected time slot is already booked.' });
        }

        // Create a new appointment
        const appointment = await db.Appointment.create({
            patientId,
            scheduleId,
            doctorId,
            startTime,
            endTime,
            status: 'booked',
        });

        res.status(201).json({ message: 'Appointment booked successfully', appointment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to book appointment', error });
    }
};