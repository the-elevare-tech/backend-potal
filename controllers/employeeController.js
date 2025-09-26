const userService = require('../services/userService');
const { generateToken } = require('../utils/jwtUtils');
const bcrypt = require('bcryptjs');

// Create new employee (for HR/Admin)
exports.createEmployee = async (req, res) => {
    try {
        // Set role as internee or employee based on request
        const employeeData = {
            ...req.body,
            role: req.body.role || 'internee'  // default to internee if not specified
        };

        const employee = await userService.createUser(employeeData);

        res.status(201).json({
            status: 'success',
            data: {
                employee
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

// Get all employees
exports.getAllEmployees = async (req, res) => {
    try {
        // Filter to only get employees and interns (not admins or HR)
        const query = {
            ...req.query,
            role: { $in: ['internee', 'teamlead'] }
        };

        const employees = await userService.getAllUsers(query);
        res.status(200).json({
            status: 'success',
            results: employees.length,
            data: {
                employees
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

// Get employee by ID
exports.getEmployee = async (req, res) => {
    try {
        const employee = await userService.getUserById(req.params.id);

        // Check if user is an employee/intern
        if (!['internee', 'teamlead'].includes(employee.role)) {
            return res.status(404).json({
                status: 'fail',
                message: 'Employee not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                employee
            }
        });
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error.message
        });
    }
};

// Update employee
exports.updateEmployee = async (req, res) => {
    try {
        // Prevent role updates through this endpoint
        if (req.body.role) {
            delete req.body.role;
        }

        const employee = await userService.updateUser(req.params.id, req.body);
        res.status(200).json({
            status: 'success',
            data: {
                employee
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

// Delete employee
exports.deleteEmployee = async (req, res) => {
    try {
        const employee = await userService.getUserById(req.params.id);

        // Ensure we're only deleting employees/interns
        if (!['internee', 'teamlead'].includes(employee.role)) {
            return res.status(400).json({
                status: 'fail',
                message: 'Cannot delete non-employee users through this endpoint'
            });
        }

        await userService.deleteUser(req.params.id);
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

// Get employee profile
exports.getEmployeeProfile = async (req, res) => {
    try {
        const employee = await userService.getUserById(req.user._id);

        if (!['internee', 'teamlead'].includes(employee.role)) {
            return res.status(403).json({
                status: 'fail',
                message: 'Access denied'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                employee
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

// Update employee's own profile
exports.updateOwnProfile = async (req, res) => {
    try {
        // Prevent role and sensitive field updates
        const allowedUpdates = ['name', 'phoneNumber', 'address', 'emergencyContact'];
        const updates = {};
        Object.keys(req.body).forEach(key => {
            if (allowedUpdates.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        const employee = await userService.updateUser(req.user._id, updates);
        res.status(200).json({
            status: 'success',
            data: {
                employee
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

// Update employee password
exports.updateEmployeePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide both old and new password'
            });
        }

        const employee = await userService.getUserById(req.user._id);

        if (!employee || !['internee', 'teamlead'].includes(employee.role)) {
            return res.status(404).json({
                status: 'fail',
                message: 'Employee not found'
            });
        }

        const isMatch = await bcrypt.compare(oldPassword, employee.password);
        if (!isMatch) {
            return res.status(401).json({
                status: 'fail',
                message: 'Current password is incorrect'
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);
        employee.password = hashedPassword;
        await employee.save();

        res.status(200).json({
            status: 'success',
            message: 'Password updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            message: error.message
        });
    }
};
