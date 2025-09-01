const Project = require('../models/Project');
const Task = require('../models/Task');
const { createNotification } = require('./notificationService');

class ProjectService {
    async createProject(projectData, createdBy) {
        try {
            const project = await Project.create(projectData);

            // Notify team lead
            await createNotification({
                recipient: project.lead,
                title: 'New Project Assignment',
                message: `You have been assigned as the lead for project: ${project.name}`,
                type: 'Project'
            });

            // Notify team members
            if (project.teamMembers && project.teamMembers.length > 0) {
                const notifications = project.teamMembers.map(memberId => ({
                    recipient: memberId,
                    title: 'New Project Assignment',
                    message: `You have been added to the project: ${project.name}`,
                    type: 'Project'
                }));

                await Promise.all(notifications.map(notification =>
                    createNotification(notification)
                ));
            }

            return project;
        } catch (error) {
            throw error;
        }
    }

    async updateProject(projectId, updateData) {
        try {
            const project = await Project.findByIdAndUpdate(
                projectId,
                updateData,
                { new: true, runValidators: true }
            ).populate('lead teamMembers');

            // If project status is updated
            if (updateData.status) {
                await createNotification({
                    recipient: project.lead,
                    title: 'Project Status Update',
                    message: `Project ${project.name} status changed to ${updateData.status}`,
                    type: 'Project'
                });
            }

            return project;
        } catch (error) {
            throw error;
        }
    }

    async getProjectDetails(projectId) {
        try {
            const project = await Project.findById(projectId)
                .populate('lead', 'name email')
                .populate('teamMembers', 'name email role');

            if (!project) {
                throw new Error('Project not found');
            }

            // Get project tasks
            const tasks = await Task.find({ project: projectId })
                .populate('assignedTo', 'name email')
                .populate('assignedBy', 'name email');

            return {
                project,
                tasks,
                statistics: {
                    totalTasks: tasks.length,
                    completedTasks: tasks.filter(task => task.status === 'Completed').length,
                    inProgressTasks: tasks.filter(task => task.status === 'In Progress').length,
                    pendingTasks: tasks.filter(task => task.status === 'Todo').length
                }
            };
        } catch (error) {
            throw error;
        }
    }

    async addTeamMember(projectId, memberId) {
        try {
            const project = await Project.findByIdAndUpdate(
                projectId,
                { $addToSet: { teamMembers: memberId } },
                { new: true }
            );

            await createNotification({
                recipient: memberId,
                title: 'Project Assignment',
                message: `You have been added to the project: ${project.name}`,
                type: 'Project'
            });

            return project;
        } catch (error) {
            throw error;
        }
    }

    async removeTeamMember(projectId, memberId) {
        try {
            const project = await Project.findByIdAndUpdate(
                projectId,
                { $pull: { teamMembers: memberId } },
                { new: true }
            );

            await createNotification({
                recipient: memberId,
                title: 'Project Update',
                message: `You have been removed from the project: ${project.name}`,
                type: 'Project'
            });

            return project;
        } catch (error) {
            throw error;
        }
    }

    async getProjectMetrics(projectId) {
        try {
            const project = await Project.findById(projectId);
            const tasks = await Task.find({ project: projectId });

            return {
                totalTasks: tasks.length,
                tasksByStatus: {
                    todo: tasks.filter(task => task.status === 'Todo').length,
                    inProgress: tasks.filter(task => task.status === 'In Progress').length,
                    completed: tasks.filter(task => task.status === 'Completed').length
                },
                tasksByPriority: {
                    high: tasks.filter(task => task.priority === 'High').length,
                    medium: tasks.filter(task => task.priority === 'Medium').length,
                    low: tasks.filter(task => task.priority === 'Low').length
                }
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new ProjectService();
