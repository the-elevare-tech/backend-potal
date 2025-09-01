const attendanceService = require('../services/attendanceService');

exports.checkIn = async (req, res) => {
    try {
        const attendance = await attendanceService.checkIn(req.user._id);
        res.status(201).json({
            status: 'success',
            data: {
                attendance
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

exports.checkOut = async (req, res) => {
    try {
        const attendance = await attendanceService.checkOut(req.user._id);
        res.status(200).json({
            status: 'success',
            data: {
                attendance
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

exports.getAttendance = async (req, res) => {
    try {
        const attendance = await attendanceService.getAttendanceReport(
            new Date(req.query.startDate),
            new Date(req.query.endDate),
            req.query.department
        );
        res.status(200).json({
            status: 'success',
            data: {
                attendance
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

exports.getAttendanceReport = async (req, res) => {
    try {
        const report = await attendanceService.getAttendanceReport(
            new Date(req.query.startDate),
            new Date(req.query.endDate),
            req.query.department
        );
        res.status(200).json({
            status: 'success',
            data: {
                report
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

exports.getUserAttendance = async (req, res) => {
    try {
        const attendance = await attendanceService.getUserAttendance(
            req.params.userId,
            parseInt(req.query.month),
            parseInt(req.query.year)
        );
        res.status(200).json({
            status: 'success',
            data: {
                attendance
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};
