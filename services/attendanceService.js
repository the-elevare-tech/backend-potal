const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { createNotification } = require('./notificationService');

class AttendanceService {
    async checkIn(userId) {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Check if attendance already exists for today
            const existingAttendance = await Attendance.findOne({
                employee: userId,
                date: today
            });

            if (existingAttendance) {
                throw new Error('Already checked in for today');
            }

            // Get standard check-in time (e.g., 9:00 AM)
            const standardCheckInTime = new Date();
            standardCheckInTime.setHours(9, 0, 0, 0);

            const currentTime = new Date();
            const status = currentTime > standardCheckInTime ? 'Late' : 'Present';

            const attendance = await Attendance.create({
                employee: userId,
                date: today,
                checkIn: currentTime,
                status
            });

            if (status === 'Late') {
                // Notify HR about late check-in
                const hrUsers = await User.find({ role: 'hr' });
                const user = await User.findById(userId);

                for (const hr of hrUsers) {
                    await createNotification({
                        recipient: hr._id,
                        title: 'Late Check-in',
                        message: `${user.name} has checked in late at ${currentTime.toLocaleTimeString()}`,
                        type: 'General'
                    });
                }
            }

            return attendance;
        } catch (error) {
            throw error;
        }
    }

    async checkOut(userId) {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const attendance = await Attendance.findOne({
                employee: userId,
                date: today
            });

            if (!attendance) {
                throw new Error('No check-in found for today');
            }

            if (attendance.checkOut) {
                throw new Error('Already checked out for today');
            }

            attendance.checkOut = new Date();
            await attendance.save();

            return attendance;
        } catch (error) {
            throw error;
        }
    }

    async getAttendanceReport(startDate, endDate, department = null) {
        try {
            const query = {
                date: {
                    $gte: startDate,
                    $lte: endDate
                }
            };

            if (department) {
                const departmentUsers = await User.find({ department }).select('_id');
                query.employee = { $in: departmentUsers.map(user => user._id) };
            }

            const attendanceRecords = await Attendance.find(query)
                .populate('employee', 'name department');

            const report = {
                totalDays: Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)),
                presentCount: attendanceRecords.filter(record => record.status === 'Present').length,
                lateCount: attendanceRecords.filter(record => record.status === 'Late').length,
                absentCount: 0, // Will be calculated
                records: attendanceRecords
            };

            // Calculate absent days
            report.absentCount = report.totalDays - (report.presentCount + report.lateCount);

            return report;
        } catch (error) {
            throw error;
        }
    }

    async getUserAttendance(userId, month, year) {
        try {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0);

            const attendance = await Attendance.find({
                employee: userId,
                date: {
                    $gte: startDate,
                    $lte: endDate
                }
            }).sort({ date: 1 });

            const totalDays = endDate.getDate();
            const presentDays = attendance.filter(a => a.status === 'Present').length;
            const lateDays = attendance.filter(a => a.status === 'Late').length;
            const absentDays = totalDays - (presentDays + lateDays);

            return {
                totalDays,
                presentDays,
                lateDays,
                absentDays,
                attendancePercentage: ((presentDays + lateDays) / totalDays) * 100,
                records: attendance
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new AttendanceService();
