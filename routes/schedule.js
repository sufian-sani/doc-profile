const express = require('express');
const {
    createSchedule,
    getAvailableSchedules,
    createAppointment
} = require('../controllers/scheduleController');
const router = express.Router();

router.post('/create', createSchedule);
router.get('/:doctorId/schedules', getAvailableSchedules);
router.post('/book', createAppointment);

module.exports = router;