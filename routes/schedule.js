const express = require('express');
const auth = require('../middleware/auth');
const isDoctor = require('../middleware/isDoctor');
const scheduleController = require('../controllers/scheduleController');
const router = express.Router();

router.get('/doctors', scheduleController.getDoctors);
router.get('/doctor/:id', scheduleController.getDoctorById);
router.post('/doctors/:doctorId/schedules', auth, isDoctor, scheduleController.createDoctorSchedule);
router.get('/doctors/:doctorId/schedules/:date/available-slots', scheduleController.getAvailableSlots);
router.post('/doctors/:doctorId/schedules/:scheduleId/slots/book', scheduleController.bookSlot);


module.exports = router;