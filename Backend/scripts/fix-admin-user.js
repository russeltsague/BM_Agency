const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('MONGO_URI is not defined in .env file');
  process.exit(1);
}

// Define a simple User schema for this fix script
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  roles: [String],
  role: String,
  isActive: Boolean
}, { collection: 'users' });

const User = mongoose.model('User', userSchema);

const fixAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Find the admin user
    const adminUser = await User.findOne({ email: 'admin@example.com' });

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
