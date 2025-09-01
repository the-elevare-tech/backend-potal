const taskService = require('../services/taskService');

exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await taskService.getTasksByUser(req.user._id, req.query);
        res.status(200).json({
            status: 'success',
            results: tasks.length,
            data: {
                tasks
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

exports.getTask = async (req, res) => {
    try {
        const task = await taskService.getTaskById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                task
            }
        });
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error.message
        });
    }
};

exports.createTask = async (req, res) => {
    try {
        const task = await taskService.createTask({
            ...req.body,
            assignedBy: req.user._id
        });

        res.status(201).json({
            status: 'success',
            data: {
                task
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const task = await taskService.updateTask(req.params.id, req.body);
        res.status(200).json({
            status: 'success',
            data: {
                task
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        await taskService.deleteTask(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

exports.updateTaskStatus = async (req, res) => {
    try {
        const task = await taskService.updateTaskStatus(
            req.params.id,
            req.body.status,
            req.user._id
        );
        res.status(200).json({
            status: 'success',
            data: {
                task
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

exports.getUserTasks = async (req, res) => {
    try {
        const tasks = await taskService.getTasksByUser(req.params.userId, req.query);
        res.status(200).json({
            status: 'success',
            results: tasks.length,
            data: {
                tasks
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

exports.getTaskMetrics = async (req, res) => {
    try {
        const metrics = await taskService.getTaskMetrics(req.user._id);
        res.status(200).json({
            status: 'success',
            data: {
                metrics
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};
