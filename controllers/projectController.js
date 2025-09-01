const projectService = require('../services/projectService');

exports.getAllProjects = async (req, res) => {
    try {
        const projects = await projectService.getProjectsByUser(req.user._id, req.query);
        res.status(200).json({
            status: 'success',
            results: projects.length,
            data: {
                projects
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

exports.getProject = async (req, res) => {
    try {
        const project = await projectService.getProjectDetails(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                project
            }
        });
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error.message
        });
    }
};

exports.createProject = async (req, res) => {
    try {
        const project = await projectService.createProject({
            ...req.body,
            createdBy: req.user._id
        });

        res.status(201).json({
            status: 'success',
            data: {
                project
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

exports.updateProject = async (req, res) => {
    try {
        const project = await projectService.updateProject(req.params.id, req.body);
        res.status(200).json({
            status: 'success',
            data: {
                project
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        await projectService.deleteProject(req.params.id);
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

exports.getProjectMembers = async (req, res) => {
    try {
        const members = await projectService.getProjectMembers(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                members
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

exports.addProjectMember = async (req, res) => {
    try {
        const project = await projectService.addTeamMember(
            req.params.id,
            req.body.memberId
        );
        res.status(200).json({
            status: 'success',
            data: {
                project
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

exports.removeProjectMember = async (req, res) => {
    try {
        const project = await projectService.removeTeamMember(
            req.params.id,
            req.body.memberId
        );
        res.status(200).json({
            status: 'success',
            data: {
                project
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

exports.getProjectMetrics = async (req, res) => {
    try {
        const metrics = await projectService.getProjectMetrics(req.params.id);
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
