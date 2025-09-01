const User = require('../models/User');
const { createNotification } = require('./notificationService');

class UserService {
    async createUser(userData) {
        try {
            const user = await User.create(userData);

            // Create welcome notification
            await createNotification({
                recipient: user._id,
                title: 'Welcome to Elevare',
                message: `Welcome ${user.name}! We're glad to have you on board.`,
                type: 'General'
            });

            return user;
        } catch (error) {
            throw error;
        }
    }

    async updateUser(userId, updateData) {
        try {
            const user = await User.findByIdAndUpdate(
                userId,
                updateData,
                { new: true, runValidators: true }
            );
            return user;
        } catch (error) {
            throw error;
        }
    }

    async getUsersByDepartment(department) {
        try {
            const users = await User.find({ department, status: 'active' });
            return users;
        } catch (error) {
            throw error;
        }
    }

    async getTeamMembers(teamLeadId) {
        try {
            const members = await User.find({
                teamLead: teamLeadId,
                status: 'active'
            });
            return members;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new UserService();
