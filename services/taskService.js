const Task = require('../models/Task');
const { createNotification } = require('./notificationService');

class TaskService {
    async createTask(taskData) {
        try {
            const task = await Task.create(taskData);

            // Notify assigned user
            await createNotification({
                recipient: task.assignedTo,
                title: 'New Task Assignment',
                message: `You have been assigned a new task: ${task.title}`,
                type: 'Task'
            });

            return task;
        } catch (error) {
            throw error;
        }
    }

    async updateTaskStatus(taskId, status, updatedBy) {
        try {
            const task = await Task.findByIdAndUpdate(
                taskId,
                { status },
                { new: true }
            ).populate('assignedTo assignedBy project');

            // Notify task creator
            await createNotification({
                recipient: task.assignedBy,
                title: 'Task Status Update',
                message: `Task "${task.title}" status has been updated to ${status}`,
                type: 'Task'
            });

            // If task is completed, notify project lead
            if (status === 'Completed') {
                const project = await task.populate('project');
                await createNotification({
                    recipient: project.lead,
                    title: 'Task Completed',
                    message: `Task "${task.title}" has been marked as completed`,
                    type: 'Task'
                });
            }

            return task;
        } catch (error) {
            throw error;
        }
    }

    async getTasksByUser(userId, filters = {}) {
        try {
            const query = { assignedTo: userId };

            if (filters.status) {
                query.status = filters.status;
            }
            if (filters.priority) {
                query.priority = filters.priority;
            }

            const tasks = await Task.find(query)
                .populate('project', 'name status')
                .populate('assignedBy', 'name email')
                .sort({ dueDate: 1 });

            return tasks;
        } catch (error) {
            throw error;
        }
    }

    async getTaskMetrics(userId) {
        try {
            const tasks = await Task.find({ assignedTo: userId });

            return {
                total: tasks.length,
                byStatus: {
                    todo: tasks.filter(task => task.status === 'Todo').length,
                    inProgress: tasks.filter(task => task.status === 'In Progress').length,
                    completed: tasks.filter(task => task.status === 'Completed').length
                },
                byPriority: {
                    high: tasks.filter(task => task.priority === 'High').length,
                    medium: tasks.filter(task => task.priority === 'Medium').length,
                    low: tasks.filter(task => task.priority === 'Low').length
                },
                overdue: tasks.filter(task =>
                    task.dueDate < new Date() && task.status !== 'Completed'
                ).length
            };
        } catch (error) {
            throw error;
        }
    }

    async reassignTask(taskId, newAssigneeId, reassignedBy) {
        try {
            const task = await Task.findByIdAndUpdate(
                taskId,
                { assignedTo: newAssigneeId },
                { new: true }
            ).populate('project');

            // Notify new assignee
            await createNotification({
                recipient: newAssigneeId,
                title: 'Task Assignment',
                message: `You have been assigned task: ${task.title}`,
                type: 'Task'
            });

            return task;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new TaskService();
