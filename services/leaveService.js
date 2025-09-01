const LeaveApplication = require('../models/LeaveApplication');
const User = require('../models/User');
const { createNotification } = require('./notificationService');

class LeaveService {
    async applyForLeave(leaveData) {
        try {
            const leave = await LeaveApplication.create(leaveData);

            // Get HR and admin users to notify
            const managers = await User.find({
                role: { $in: ['hr', 'admin'] }
            });

            // Notify HR/admin about new leave application
            for (const manager of managers) {
                await createNotification({
                    recipient: manager._id,
                    title: 'New Leave Application',
                    message: `New leave application received from ${leave.employee.name}`,
                    type: 'Leave'
                });
            }

            return leave;
        } catch (error) {
            throw error;
        }
    }

    async updateLeaveStatus(leaveId, status, approvedBy) {
        try {
            const leave = await LeaveApplication.findByIdAndUpdate(
                leaveId,
                {
                    status,
                    approvedBy: status === 'Approved' ? approvedBy : undefined
                },
                { new: true }
            ).populate('employee');

            // Notify employee about leave status
            await createNotification({
                recipient: leave.employee._id,
                title: 'Leave Application Update',
                message: `Your leave application has been ${status.toLowerCase()}`,
                type: 'Leave'
            });

            return leave;
        } catch (error) {
            throw error;
        }
    }

    async getUserLeaves(userId, status = null) {
        try {
            const query = { employee: userId };
            if (status) {
                query.status = status;
            }

            const leaves = await LeaveApplication.find(query)
                .populate('approvedBy', 'name email')
                .sort({ createdAt: -1 });

            return leaves;
        } catch (error) {
            throw error;
        }
    }

    async getLeaveMetrics(userId) {
        try {
            const currentYear = new Date().getFullYear();
            const leaves = await LeaveApplication.find({
                employee: userId,
                startDate: {
                    $gte: new Date(currentYear, 0, 1),
                    $lte: new Date(currentYear, 11, 31)
                }
            });

            return {
                total: leaves.length,
                byStatus: {
                    pending: leaves.filter(leave => leave.status === 'Pending').length,
                    approved: leaves.filter(leave => leave.status === 'Approved').length,
                    rejected: leaves.filter(leave => leave.status === 'Rejected').length
                },
                byType: {
                    sick: leaves.filter(leave => leave.type === 'Sick').length,
                    casual: leaves.filter(leave => leave.type === 'Casual').length,
                    annual: leaves.filter(leave => leave.type === 'Annual').length
                }
            };
        } catch (error) {
            throw error;
        }
    }

    async getDepartmentLeaves(department, status = null) {
        try {
            const departmentUsers = await User.find({ department }).select('_id');
            const query = {
                employee: { $in: departmentUsers.map(user => user._id) }
            };

            if (status) {
                query.status = status;
            }

            const leaves = await LeaveApplication.find(query)
                .populate('employee', 'name email')
                .populate('approvedBy', 'name email')
                .sort({ createdAt: -1 });

            return leaves;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new LeaveService();
