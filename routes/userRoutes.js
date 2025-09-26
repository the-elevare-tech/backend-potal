const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/authMiddleware');
const {
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    login,
    register,
    updatePassword,
    getProfile
} = require('../controllers/userController');

// Public routes
router.post('/login', login);
router.post('/register', register);

// Protected routes
router.use(protect);

// Profile routes
router.get('/profile', getProfile);
router.patch('/update-password', updatePassword);

// Admin only routes
router.use(restrictTo('admin', 'hr'));
router
    .route('/')
    .get(getAllUsers)
// .post(createUser);

router
    .route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);

module.exports = router;
