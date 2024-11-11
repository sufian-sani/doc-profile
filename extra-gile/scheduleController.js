// controllers/doctorController.js
// const { models } = require('../models');

// exports.createSchedule = async (req, res) => {
//     const { doctorId, date, startTime, endTime } = req.body;
//     try {
//         const schedule = await models.DoctorSchedule.create({ doctorId, date, startTime, endTime });
//         res.status(201).json(schedule);
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to create schedule' });
//     }
// };
//
// exports.bookAppointment = async (req, res) => {
//     const { doctorScheduleId, patientId } = req.body;
//     try {
//         const appointment = await models.Appointment.create({ doctorScheduleId, patientId });
//         res.status(201).json(appointment);
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to book appointment' });
//     }
// };