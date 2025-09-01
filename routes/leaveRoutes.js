const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/authMiddleware');
const {
    getAllLeaves,
    getLeave,
    createLeave,
    updateLeave,
    deleteLeave,
    approveLeave,
    rejectLeave,
    getUserLeaves
} = require('../controllers/leaveController');

router.use(protect);

// Employee routes
router
    .route('/')
    .get(getAllLeaves)
    .post(createLeave);

router
    .route('/:id')
    .get(getLeave)
    .patch(updateLeave)
    .delete(deleteLeave);

// HR/Admin routes
router.patch('/:id/approve', restrictTo('admin', 'hr'), approveLeave);
router.patch('/:id/reject', restrictTo('admin', 'hr'), rejectLeave);

// Get user's leaves
router.get('/user/:userId', getUserLeaves);

module.exports = router;
