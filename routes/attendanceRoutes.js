const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    checkIn,
    checkOut,
    getAttendance,
    getAttendanceReport,
    getUserAttendance
} = require('../controllers/attendanceController');

router.use(protect);

router.post('/check-in', checkIn);
router.post('/check-out', checkOut);
router.get('/report', getAttendanceReport);
router.get('/user/:userId', getUserAttendance);
router.get('/', getAttendance);

module.exports = router;
