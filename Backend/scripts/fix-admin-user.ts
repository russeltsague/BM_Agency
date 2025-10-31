import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../src/models/User';

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const ADMIN_EMAIL = 'admin@example.com';

if (!MONGO_URI) {
  console.error('MONGO_URI is not defined in .env file');
  process.exit(1);
}

const fixAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Find the admin user
    const adminUser = await User.findOne({ email: ADMIN_EMAIL });

    if (!adminUser) {
      console.log('Admin user not found. Please run the init-db script first.');
      process.exit(1);
    }

    console.log('Current admin user roles:', adminUser.roles);
    console.log('Current admin user role field:', adminUser.role);

    // Fix the roles array to include 'admin'
    if (!adminUser.roles.includes('admin')) {
      adminUser.roles = ['admin'];
      await adminUser.save();
      console.log('✅ Admin user roles fixed!');
      console.log('Updated roles:', adminUser.roles);
    } else {
      console.log('✅ Admin user already has correct roles');
    }

    console.log('Admin user fix completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing admin user:', error);
    process.exit(1);
  }
};

fixAdminUser();
