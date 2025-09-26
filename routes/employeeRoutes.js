const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/authMiddleware');
const {
    createEmployee,
    getAllEmployees,
    getEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeeProfile,
    updateOwnProfile,
    updateEmployeePassword
} = require('../controllers/employeeController');

// Protected routes - all routes require authentication
router.use(protect);

// Employee profile routes (for employees themselves)
router.get('/profile', getEmployeeProfile);
router.patch('/profile/update', updateOwnProfile);
router.patch('/profile/password', updateEmployeePassword);

// Admin/HR only routes
router.use(restrictTo('admin', 'hr'));

// Employee management routes
router.route('/')
    .get(getAllEmployees)
    .post(createEmployee);

router.route('/:id')
    .get(getEmployee)
    .patch(updateEmployee)
    .delete(deleteEmployee);

module.exports = router;
