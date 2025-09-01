const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getNotifications,
    markAsRead,
    deleteNotification,
    getUnreadCount
} = require('../controllers/notificationController');

router.use(protect);

router
    .route('/')
    .get(getNotifications);

router.get('/unread-count', getUnreadCount);
router.patch('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

module.exports = router;
