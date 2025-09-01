const mongoose = require('mongoose');

const teamLeadSchema = new mongoose.Schema({
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
        default: 'team_lead'
    },
    phoneNumber: {
        type: String
    },
    department: {
        type: String,
        required: true
    },
    team: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Junior'  // Reference to team members
    }],
    projects: [{
        projectName: String,
        description: String,
        startDate: Date,
        deadline: Date,
        status: {
            type: String,
            enum: ['planning', 'in-progress', 'review', 'completed'],
            default: 'planning'
        }
    }],
    experience: {
        type: Number,
        required: true
    },
    skills: [{
        type: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('TeamLead', teamLeadSchema);
