const mongoose = require('mongoose');

const juniorSchema = new mongoose.Schema({
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
        enum: ['intern', 'junior'],
        required: true
    },
    phoneNumber: {
        type: String
    },
    teamLead: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TeamLead'
    },
    department: {
        type: String,
        required: true
    },
    skills: [{
        type: String
    }],
    assignedTasks: [{
        taskName: String,
        description: String,
        deadline: Date,
        status: {
            type: String,
            enum: ['pending', 'in-progress', 'review', 'completed'],
            default: 'pending'
        },
        feedback: String
    }],
    attendance: [{
        date: Date,
        status: {
            type: String,
            enum: ['present', 'absent', 'half-day', 'leave'],
            default: 'present'
        }
    }],
    performance: {
        rating: {
            type: Number,
            min: 0,
            max: 5
        },
        remarks: String,
        lastReviewDate: Date
    },
    joiningDate: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Junior', juniorSchema);
