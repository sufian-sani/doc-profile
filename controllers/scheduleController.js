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
// exports.getAvailableSlots = async (req, res) => {
//     const { doctorId, date } = req.params;
//
//     try {
//         // Find the doctor's schedule for the given date
//         const schedule = await db.Schedule.findAll({
//             where: {
//                 doctorId: doctorId,
//                 date: date,  // Match the date
//             },
//             include: [{
//                 model: db.Appointment,
//                 as: 'appointment',
//                 where: {
//                     status: 'booked', // Only check booked appointments for conflict
//                     [Op.or]: [
//                         { startTime: { [Op.gte]: literal("DATETIME('now')") } } // Filters appointments with startTime in the future
//                     ]
//                 },
//                 required: false  // Include even if no appointment exists
//             }]
//         });
//
//         // If no schedule found for the doctor on this date, return an error
//         if (!schedule.length) {
//             return res.status(404).json({ message: 'No schedule found for this doctor on this date.' });
//         }
//
//         // Process the schedule and find available time slots
//         const availableSlots = schedule.map((slot) => {
//             const existingAppointments = slot.appointment;
//
//             // Create the time slot range for the doctor
//             let slots = [];
//             let startTime = new Date(`${date}T${slot.startTime}`);
//             let endTime = new Date(`${date}T${slot.endTime}`);
//
//             // Iterate through the time range and check for availability
//             while (startTime < endTime) {
//                 let slotAvailable = true;
//                 existingAppointments.forEach((appointment) => {
//                     const appointmentStart = new Date(appointment.startTime);
//                     const appointmentEnd = new Date(appointment.endTime);
//                     if (startTime >= appointmentStart && startTime < appointmentEnd) {
//                         slotAvailable = false;
//                     }
//                 });
//
//                 if (slotAvailable) {
//                     slots.push({
//                         startTime: startTime.toISOString(),
//                         endTime: new Date(startTime.getTime() + 30 * 60000).toISOString(), // Adding 30 minutes
//                     });
//                 }
//
//                 startTime = new Date(startTime.getTime() + 30 * 60000); // Increment by 30 minutes
//             }
//
//             return {
//                 date: slot.date,
//                 doctorId: slot.doctorId,
//                 availableSlots: slots,
//             };
//         });
//
//         // Return available slots
//         res.json(availableSlots);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Failed to fetch available slots.' });
//     }
// };

// exports.getAvailableSlots = async (req, res) => {
//     const { doctorId, date } = req.params;
//
//     try {
//         // Find the doctor's schedule for the given date
//         const schedule = await db.Schedule.findAll({
//             where: {
//                 doctorId: doctorId,
//                 date: date,  // Match the date
//             },
//             include: [{
//                 model: db.Appointment,
//                 as: 'appointment',  // Correct association name (it should be plural if multiple)
//                 where: {
//                     status: 'booked', // Only check booked appointments for conflict
//                     [Op.or]: [
//                         { startTime: { [Op.gte]: literal("DATETIME('now')") } } // Filters appointments with startTime in the future
//                     ]
//                 },
//                 required: false  // Include even if no appointment exists
//             }]
//         });
//
//         // If no schedule found for the doctor on this date, return an error
//         if (!schedule.length) {
//             return res.status(404).json({ message: 'No schedule found for this doctor on this date.' });
//         }
//
//         // Process the schedule and find available time slots
//         const availableSlots = schedule.map((slot) => {
//             const existingAppointments = slot.appointment;
//
//             // Create the time slot range for the doctor
//             let slots = [];
//             let startTime = new Date(`${date}T${slot.startTime}`);
//             let endTime = new Date(`${date}T${slot.endTime}`);
//
//             // Iterate through the time range and check for availability
//             while (startTime < endTime) {
//                 let slotAvailable = true;
//
//                 // Check if the slot conflicts with any existing appointment
//                 existingAppointments.forEach((appointment) => {
//                     const appointmentStart = new Date(appointment.startTime);
//                     const appointmentEnd = new Date(appointment.endTime);
//                     if (startTime >= appointmentStart && startTime < appointmentEnd) {
//                         slotAvailable = false;
//                     }
//                 });
//
//                 // If the slot is available, add it to the available slots array
//                 if (slotAvailable) {
//                     slots.push({
//                         startTime: startTime.toISOString(),
//                         endTime: new Date(startTime.getTime() + 30 * 60000).toISOString(), // Adding 30 minutes
//                     });
//                 }
//
//                 // Increment the start time by 30 minutes
//                 startTime = new Date(startTime.getTime() + 30 * 60000);
//             }
//
//             return {
//                 date: slot.date,
//                 doctorId: slot.doctorId,
//                 availableSlots: slots,
//             };
//         });
//
//         // Return available slots
//         res.json(availableSlots);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Failed to fetch available slots.' });
//     }
// };

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

// doctor book
exports.bookAppointment = async (req, res) => {
    const { doctorId, scheduleId } = req.params;
    const { patientId, startTime, endTime } = req.body;  // Assuming patientId and times are sent in the request body

    try {
        // Check if the schedule exists and belongs to the specified doctor
        const schedule = await db.Schedule.findOne({
            where: {
                id: scheduleId,
                doctorId: doctorId,  // Ensure the schedule belongs to the correct doctor
            },
        });

        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found for this doctor.' });
        }

        // Ensure the selected appointment time is within the schedule's start and end time
        const scheduleStartTime = new Date(`${schedule.date}T${schedule.startTime}`);
        const scheduleEndTime = new Date(`${schedule.date}T${schedule.endTime}`);
        const appointmentStart = new Date(startTime);
        const appointmentEnd = new Date(endTime);

        if (appointmentStart < scheduleStartTime || appointmentEnd > scheduleEndTime) {
            return res.status(400).json({ message: 'Selected time is outside the doctor\'s available schedule.' });
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

// exports.bookAppointment = async (req, res) => {
//     const { doctorId, scheduleId } = req.params;
//     const { patientId, startTime, endTime } = req.body;
//
//     try {
//         // Check if the time slot is already booked
//         const existingAppointment = await db.Appointment.findOne({
//             where: {
//                 doctorId,
//                 startTime: { [Op.lte]: endTime },
//                 endTime: { [Op.gte]: startTime },
//                 status: 'booked', // Only check booked appointments
//             },
//         });
//
//         if (existingAppointment) {
//             return res.status(409).json({ message: 'This time slot is already booked.' });
//         }
//
//         // Create the new appointment
//         const appointment = await db.Appointment.create({
//             patientId,
//             doctorId,
//             startTime,
//             endTime,
//             status: 'booked',
//         });
//
//         res.status(201).json({ message: 'Appointment booked successfully!', appointment });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Failed to book appointment', error });
//     }
// };

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

// slot list
// ---------------------
exports.getAvailableSlots = async (req, res) => {
    const { doctorId, date } = req.params;

    try {
        // Retrieve the doctor's schedule for the given date
        const schedule = await db.Schedule.findOne({
            where: {
                doctorId: doctorId,
                date: date,  // Matching date (YYYY-MM-DD)
            },
            include: [{
                model: db.Appointment,
                as: 'appointment',
                where: {
                    status: 'booked'
                },
                required: false // Include even if no appointment exists
            }]
        });

        // If no schedule found for the doctor on this date, return an error
        if (!schedule) {
            return res.status(404).json({ message: 'No schedule found for this doctor on this date.' });
        }

        const availableSlots = [];
        const scheduleStart = new Date(`${date}T${schedule.startTime}`);
        const scheduleEnd = new Date(`${date}T${schedule.endTime}`);

        // Get existing booked appointments for this schedule
        const bookedSlots = schedule.appointment.map(app => ({
            start: new Date(app.startTime),
            end: new Date(app.endTime),
        }));

        // Generate 30-minute slots within the schedule's time range
        let currentSlotStart = new Date(scheduleStart);

        while (currentSlotStart < scheduleEnd) {
            const currentSlotEnd = new Date(currentSlotStart.getTime() + 30 * 60000); // Add 30 minutes

            // Check if the slot overlaps with any booked appointment
            const isBooked = bookedSlots.some(({ start, end }) =>
                (currentSlotStart >= start && currentSlotStart < end) ||
                (currentSlotEnd > start && currentSlotEnd <= end) ||
                (currentSlotStart <= start && currentSlotEnd >= end)
            );

            // If slot is not booked, add it to the available slots list
            if (!isBooked && currentSlotEnd <= scheduleEnd) {
                availableSlots.push({
                    startTime: currentSlotStart.toISOString(),
                    endTime: currentSlotEnd.toISOString(),
                    formattedSlot: `${currentSlotStart.getHours()}:${currentSlotStart.getMinutes().toString().padStart(2, '0')}-${currentSlotEnd.getHours()}:${currentSlotEnd.getMinutes().toString().padStart(2, '0')}`
                });
            }

            // Move to the next 30-minute slot
            currentSlotStart = new Date(currentSlotStart.getTime() + 30 * 60000);
        }

        res.json(availableSlots);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch available slots.' });
    }
};

// exports.getAvailableSlots = async (req, res) => {
//     const { doctorId, date } = req.params;
//
//     try {
//         // Find the doctor's schedule for the given date
//         const schedule = await db.Schedule.findAll({
//             where: {
//                 doctorId: doctorId,
//                 date: date,  // Match the date (YYYY-MM-DD)
//             },
//             include: [{
//                 model: db.Appointment,
//                 as: 'appointment',
//                 where: {
//                     status: 'booked', // Only check booked appointments for conflict
//                     [Op.or]: [
//                         { startTime: { [Op.gte]: literal("DATETIME('now')") } } // Filters appointments with startTime in the future
//                     ]
//                 },
//                 required: false  // Include even if no appointment exists
//             }]
//         });
//
//         // If no schedule found for the doctor on this date, return an error
//         if (!schedule.length) {
//             return res.status(404).json({ message: 'No schedule found for this doctor on this date.' });
//         }
//
//         // Process the schedule and find available time slots
//         const availableSlots = [];
//
//         // Iterate over each schedule to get the time slots
//         for (const slot of schedule) {
//             const existingAppointments = slot.appointment;
//
//             // Create the time slot range for the doctor
//             let startTime = new Date(`${date}T${slot.startTime}`);
//             let endTime = new Date(`${date}T${slot.endTime}`);
//
//             // Iterate through the time range and check for availability
//             let currentSlotStart = new Date(startTime);
//
//             // Generate 30-minute slots
//             while (currentSlotStart < endTime) {
//                 let slotAvailable = true;
//
//                 // Check if the slot conflicts with any existing appointment
//                 existingAppointments.forEach((appointment) => {
//                     const appointmentStart = new Date(appointment.startTime);
//                     const appointmentEnd = new Date(appointment.endTime);
//
//                     // If the new slot overlaps with any appointment, it's not available
//                     if (
//                         (currentSlotStart >= appointmentStart && currentSlotStart < appointmentEnd) ||
//                         (currentSlotStart < appointmentStart && new Date(currentSlotStart.getTime() + 30 * 60000) > appointmentStart)
//                     ) {
//                         slotAvailable = false;
//                     }
//                 });
//
//                 // If the slot is available and not overlapping with booked appointments
//                 if (slotAvailable) {
//                     const slotEndTime = new Date(currentSlotStart.getTime() + 30 * 60000);  // Adding 30 minutes
//
//                     // Format the slot as "startTime-endTime"
//                     const formattedStartTime = `${currentSlotStart.getUTCHours()}:${currentSlotStart.getUTCMinutes() < 10 ? '0' + currentSlotStart.getUTCMinutes() : currentSlotStart.getUTCMinutes()}`;
//                     const formattedEndTime = `${slotEndTime.getUTCHours()}:${slotEndTime.getUTCMinutes() < 10 ? '0' + slotEndTime.getUTCMinutes() : slotEndTime.getUTCMinutes()}`;
//
//                     // Add slot to the available slots list
//                     availableSlots.push({
//                         startTime: currentSlotStart.toISOString(),
//                         endTime: slotEndTime.toISOString(),
//                         formattedSlot: `${formattedStartTime}-${formattedEndTime}`,
//                     });
//                 }
//
//                 // Increment the start time by 30 minutes
//                 currentSlotStart.setMinutes(currentSlotStart.getMinutes() + 30);
//             }
//         }
//
//         // Return available slots
//         res.json(availableSlots);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Failed to fetch available slots.' });
//     }
// };



// exports.getAvailableSlots = async (req, res) => {
//     const { doctorId, date } = req.params;
//
//     try {
//         // Find the doctor's schedule for the given date
//         const schedule = await db.Schedule.findAll({
//             where: {
//                 doctorId: doctorId,
//                 date: date,  // Match the date (YYYY-MM-DD)
//             },
//             include: [{
//                 model: db.Appointment,
//                 as: 'appointment', // Ensure this matches the correct association name
//                 where: {
//                     status: 'booked', // Only check booked appointments for conflict
//                 },
//                 required: false,  // Include even if no appointment exists
//             }],
//         });
//
//         // If no schedule found for the doctor on this date, return an error
//         if (!schedule.length) {
//             return res.status(404).json({ message: 'No schedule found for this doctor on this date.' });
//         }
//
//         // Process the schedule and find available time slots
//         const availableSlots = [];
//
//         // Iterate over each schedule to get the time slots
//         for (const slot of schedule) {
//             const existingAppointments = slot.appointment; // Access the appointments correctly
//
//             // Create the time slot range for the doctor
//             let startTime = moment(`${date}T${slot.startTime}`);  // Use moment.js for better handling
//             let endTime = moment(`${date}T${slot.endTime}`);
//
//             // Iterate through the time range and check for availability
//             let currentSlotStart = startTime.clone().add(1, 'minute');  // Start from the exact minute (e.g., 4:01)
//
//             // Generate 30-minute slots
//             while (currentSlotStart < endTime) {
//                 let slotAvailable = true;
//
//                 // Check if the slot conflicts with any existing appointment
//                 existingAppointments.forEach((appointment) => {
//                     const appointmentStart = moment(appointment.startTime);
//                     const appointmentEnd = moment(appointment.endTime);
//
//                     // If the new slot overlaps with any appointment, it's not available
//                     if (
//                         (currentSlotStart.isBetween(appointmentStart, appointmentEnd, null, '[)')) ||
//                         (currentSlotStart.clone().add(30, 'minutes').isBetween(appointmentStart, appointmentEnd, null, '[)'))
//                     ) {
//                         slotAvailable = false;
//                     }
//                 });
//
//                 // If the slot is available, add it to the available slots array
//                 if (slotAvailable) {
//                     const slotEndTime = currentSlotStart.clone().add(30, 'minutes');
//
//                     // Format the slot as "startTime-endTime"
//                     const formattedStartTime = currentSlotStart.format('HH:mm');
//                     const formattedEndTime = slotEndTime.format('HH:mm');
//
//                     // Add the slot to the available slots list
//                     availableSlots.push({
//                         startTime: currentSlotStart.toISOString(),
//                         endTime: slotEndTime.toISOString(),
//                         formattedSlot: `${formattedStartTime}-${formattedEndTime}`
//                     });
//                 }
//
//                 // Increment the start time by 30 minutes
//                 currentSlotStart.add(30, 'minutes');
//             }
//         }
//         console.log(availableSlots.length);
//
//         // Return available slots
//         res.json(availableSlots);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Failed to fetch available slots.' });
//     }
// };
