import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables - check if we're in test mode
if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: path.join(__dirname, '../../.env.test') });
} else {
  dotenv.config({ path: path.join(__dirname, '../../.env') });
}

const connectDB = async (): Promise<void> => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment file');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connecté');
  } catch (error) {
    console.error('Erreur de connexion à MongoDB:', error);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;
