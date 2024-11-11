const express = require('express');
const {
    createSchedule,
    getAvailableSchedules,
    createAppointment,
    getDoctors,
    getDoctorById
} = require('../controllers/scheduleController');
const router = express.Router();

router.post('/create', createSchedule);
router.get('/:doctorId/schedules', getAvailableSchedules);
router.post('/book', createAppointment);
router.get('/doctors', getDoctors);
router.get('/doctors/:id', getDoctorById);

module.exports = router;