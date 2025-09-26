const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

const createDefaultAdmin = async () => {
    try {
        // Check if admin already exists
        const adminExists = await Admin.findOne({ email: 'admin@elevare.com' });

        if (adminExists) {
            console.log('Default admin already exists');
            return;
        }

        // Create default admin
        const hashedPassword = await bcrypt.hash('admin123', 12);

        const defaultAdmin = await Admin.create({
            name: 'Admin',
            email: 'techelevare@gmail.com',
            password: hashedPassword,
            role: 'admin',
            phoneNumber: '+92-000-0000000',
            permissions: ['all'],
            status: 'active',
            department: 'Administration',
            joinDate: new Date(),
            cnic: '00000-0000000-0',
            address: 'Elevare Technologies Office',
            dob: new Date('1990-01-01'),
            emergencyContact: '+92-000-0000000'
        });

        console.log('Default admin created successfully:', defaultAdmin.email);
    } catch (error) {
        console.error('Error creating default admin:', error);
    }
};

module.exports = createDefaultAdmin;
