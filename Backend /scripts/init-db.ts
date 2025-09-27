import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../src/models/User';
import { Article } from '../src/models/Article';
import { Service } from '../src/models/Service';

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('MONGO_URI is not defined in .env file');
  process.exit(1);
}

const initDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Create indexes
    await User.init();
    console.log('User indexes created');

    await Article.init();
    console.log('Article indexes created');

    await Service.init();
    console.log('Service indexes created');

    // Create default admin user if it doesn't exist
    const adminEmail = 'admin@example.com';
    const adminPassword = 'admin123';
    
    const adminExists = await User.findOne({ email: adminEmail });
    
    if (!adminExists) {
      const admin = new User({
        name: 'Admin User',
        email: adminEmail,
        password: adminPassword,
        role: 'admin'
      });
      
      await admin.save();
      console.log('Default admin user created');
      console.log(`Email: ${adminEmail}`);
      console.log(`Password: ${adminPassword}`);
      console.log('PLEASE CHANGE THESE CREDENTIALS AFTER FIRST LOGIN!');
    } else {
      console.log('Admin user already exists');
    }

    console.log('Database initialization completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

initDB();
