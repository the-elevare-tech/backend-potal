const mongoose = require('mongoose');

const hrSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'hr'
    },
    phoneNumber: {
        type: String
    },
    department: {
        type: String,
        default: 'Human Resources'
    },
    responsibilities: [{
        type: String
    }],
    assignedTasks: [{
        taskName: String,
        deadline: Date,
        status: {
            type: String,
            enum: ['pending', 'in-progress', 'completed'],
            default: 'pending'
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('HR', hrSchema);
