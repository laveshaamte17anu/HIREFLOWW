process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const dns = require('dns');

const User = require('../models/User');

// MongoDB Atlas DNS fix
dns.setServers(['8.8.8.8', '1.1.1.1']);

dotenv.config({
  path: path.join(__dirname, '../.env'),
});

const seedAdmin = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      console.error('ERROR: MONGODB_URI is missing in .env');
      process.exit(1);
    }

    const adminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || '';

    if (!adminEmail || !adminPassword) {
      console.error(
        'ERROR: ADMIN_EMAIL or ADMIN_PASSWORD is missing in .env'
      );
      process.exit(1);
    }

    await mongoose.connect(mongoUri);

    console.log('MongoDB Connected for Admin Seeding...');
    console.log(`Checking admin account: ${adminEmail}`);

    // Check if admin email already exists
    let adminUser = await User.findOne({
      email: adminEmail,
    }).select('+password');

    if (adminUser) {
      // Existing account -> convert it to admin
      adminUser.role = 'admin';
      adminUser.password = adminPassword;

      if (!adminUser.name) {
        adminUser.name = 'HireFlow Admin';
      }

      await adminUser.save();

      console.log('------------------------------------------');
      console.log('ADMIN ACCOUNT UPDATED SUCCESSFULLY');
      console.log(`Email: ${adminEmail}`);
      console.log('Role: admin');
      console.log('Password: Updated from .env');
      console.log('------------------------------------------');
    } else {
      // Create new admin account
      adminUser = new User({
        name: 'HireFlow Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        phone: '',
        location: '',
        education: '',
        skills: [],
        linkedin: '',
        github: '',
        portfolio: '',
      });

      await adminUser.save();

      console.log('------------------------------------------');
      console.log('ADMIN ACCOUNT CREATED SUCCESSFULLY');
      console.log(`Email: ${adminEmail}`);
      console.log('Role: admin');
      console.log('------------------------------------------');
    }

    await mongoose.connection.close();

    console.log('MongoDB connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('------------------------------------------');
    console.error('ADMIN SEED ERROR');
    console.error(error.message);
    console.error('------------------------------------------');

    try {
      await mongoose.connection.close();
    } catch (closeError) {
      // Ignore close error
    }

    process.exit(1);
  }
};

seedAdmin();