const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/authMiddleware');
const {
    getAllProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    getProjectMembers,
    addProjectMember,
    removeProjectMember
} = require('../controllers/projectController');

router.use(protect);

// General project routes
router
    .route('/')
    .get(getAllProjects)
    .post(restrictTo('admin', 'teamlead'), createProject);

router
    .route('/:id')
    .get(getProject)
    .patch(restrictTo('admin', 'teamlead'), updateProject)
    .delete(restrictTo('admin', 'teamlead'), deleteProject);

// Project members routes
router
    .route('/:id/members')
    .get(getProjectMembers)
    .post(restrictTo('admin', 'teamlead'), addProjectMember)
    .delete(restrictTo('admin', 'teamlead'), removeProjectMember);

module.exports = router;
