const Notification = require('../models/Notification');

class NotificationService {
    async createNotification(notificationData) {
        try {
            const notification = await Notification.create(notificationData);
            return notification;
        } catch (error) {
            throw error;
        }
    }

    async getUserNotifications(userId, filter = {}) {
        try {
            const query = { recipient: userId };

            if (filter.read !== undefined) {
                query.read = filter.read;
            }
            if (filter.type) {
                query.type = filter.type;
            }

            const notifications = await Notification.find(query)
                .sort({ createdAt: -1 })
                .limit(filter.limit || 50);

            return notifications;
        } catch (error) {
            throw error;
        }
    }

    async markAsRead(notificationId) {
        try {
            const notification = await Notification.findByIdAndUpdate(
                notificationId,
                { read: true },
                { new: true }
            );
            return notification;
        } catch (error) {
            throw error;
        }
    }

    async markAllAsRead(userId) {
        try {
            const result = await Notification.updateMany(
                { recipient: userId, read: false },
                { read: true }
            );
            return result;
        } catch (error) {
            throw error;
        }
    }

    async getUnreadCount(userId) {
        try {
            const count = await Notification.countDocuments({
                recipient: userId,
                read: false
            });
            return count;
        } catch (error) {
            throw error;
        }
    }

    async deleteOldNotifications(days = 30) {
        try {
            const date = new Date();
            date.setDate(date.getDate() - days);

            const result = await Notification.deleteMany({
                createdAt: { $lt: date },
                read: true
            });

            return result;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new NotificationService();
