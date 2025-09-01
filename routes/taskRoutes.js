const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/authMiddleware');
const {
    getAllTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    getUserTasks,
    updateTaskStatus
} = require('../controllers/taskController');

router.use(protect);

// Task routes
router
    .route('/')
    .get(getAllTasks)
    .post(restrictTo('admin', 'teamlead'), createTask);

router
    .route('/:id')
    .get(getTask)
    .patch(updateTask)
    .delete(restrictTo('admin', 'teamlead'), deleteTask);

// Task status update
router.patch('/:id/status', updateTaskStatus);

// Get user's tasks
router.get('/user/:userId/tasks', getUserTasks);

module.exports = router;
