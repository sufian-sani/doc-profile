const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctor.controller');
const scheduleController = require('../controllers/schedule.controller');
const appointmentController = require('../controllers/appointment.controller');


router.post('/', doctorController.createDoctor);
router.post('/:doctorId/schedules', scheduleController.createSchedule);
router.get('/:doctorId/availability', appointmentController.getAvailability);
router.post('/', appointmentController.bookAppointment);

module.exports = router;
