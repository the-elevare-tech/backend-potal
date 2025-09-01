const leaveService = require('../services/leaveService');

exports.getAllLeaves = async (req, res) => {
    try {
        const leaves = await leaveService.getUserLeaves(req.user._id, req.query.status);
        res.status(200).json({
            status: 'success',
            results: leaves.length,
            data: {
                leaves
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

exports.getLeave = async (req, res) => {
    try {
        const leave = await leaveService.getLeaveById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                leave
            }
        });
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error.message
        });
    }
};

exports.createLeave = async (req, res) => {
    try {
        const leave = await leaveService.applyForLeave({
            ...req.body,
            employee: req.user._id
        });

        res.status(201).json({
            status: 'success',
            data: {
                leave
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

exports.updateLeave = async (req, res) => {
    try {
        const leave = await leaveService.updateLeave(req.params.id, req.body);
        res.status(200).json({
            status: 'success',
            data: {
                leave
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

exports.deleteLeave = async (req, res) => {
    try {
        await leaveService.deleteLeave(req.params.id);
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

exports.approveLeave = async (req, res) => {
    try {
        const leave = await leaveService.updateLeaveStatus(
            req.params.id,
            'Approved',
            req.user._id
        );
        res.status(200).json({
            status: 'success',
            data: {
                leave
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

exports.rejectLeave = async (req, res) => {
    try {
        const leave = await leaveService.updateLeaveStatus(
            req.params.id,
            'Rejected',
            req.user._id
        );
        res.status(200).json({
            status: 'success',
            data: {
                leave
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

exports.getUserLeaves = async (req, res) => {
    try {
        const leaves = await leaveService.getUserLeaves(req.params.userId, req.query.status);
        res.status(200).json({
            status: 'success',
            results: leaves.length,
            data: {
                leaves
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};
