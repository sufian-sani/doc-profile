const express = require('express');
const {
    createSchedule,
    getAvailableSchedules,
    createAppointment,
    getDoctors,
    getDoctorById,
    getAvailableSlots,
    bookAppointment
} = require('../controllers/scheduleController');
const router = express.Router();

router.post('/create', createSchedule);
// router.get('/:doctorId/schedules', getAvailableSchedules);
// router.post('/book', createAppointment);
// router.post('/appointments', bookAppointment);
// router.post('/doctors/:doctorId/schedules/:scheduleId/book', bookAppointment);
// router.post('/doctors/book-appointment', bookAppointment);
router.post('/book-appointment/:doctorId/:scheduleId', bookAppointment);
router.get('/doctors', getDoctors);
router.get('/doctors/:id', getDoctorById);
router.get('/doctors/:doctorId/schedules/:date/slots', getAvailableSlots);

module.exports = router;