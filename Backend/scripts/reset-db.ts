import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables - check if we're in test mode
if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: path.join(__dirname, '../.env.test') });
} else {
  dotenv.config();
}

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('MONGO_URI is not defined in .env file');
  process.exit(1);
}

const resetDB = async () => {
  try {
    // Connect to MongoDB
    const conn = await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Drop all collections
    if (mongoose.connection.db) {
      const collections = await mongoose.connection.db.collections();

      for (let collection of collections) {
        await collection.drop();
        console.log(`Dropped collection: ${collection.collectionName}`);
      }
    }

    console.log('Database reset completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error resetting database:', error);
    process.exit(1);
  }
};

resetDB();
