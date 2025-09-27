import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Increase test timeout to 5 minutes
jest.setTimeout(300000);

// Load environment variables from .env.test
const envPath = path.resolve(__dirname, '../../../.env.test');
dotenv.config({ path: envPath });

// Get the MongoDB URI from environment
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error('MONGO_URI is not defined in test environment');
}

console.log('Using MongoDB URI:', mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));

/**
 * Connect to the real MongoDB database for testing.
 */
export const connect = async () => {
  if (mongoose.connection.readyState === 1) {
    return; // Already connected
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 45000, // 45 seconds
      maxPoolSize: 10, // Maximum number of connections in the connection pool
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

/**
 * Close the database connection.
 */
export const closeDatabase = async () => {
  await mongoose.connection.close();
};

/**
 * Remove all the data for all db collections.
 */
export const clearDatabase = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    try {
      await collection.deleteMany({});
    } catch (error) {
      console.error(`Error clearing collection ${key}:`, error);
    }
  }
};

// Setup database connection before tests run
export const setupTestDB = () => {
  // Set timeout for all tests to 60 seconds
  jest.setTimeout(60000);

  // Connect to the database before running any tests
  beforeAll(async () => {
    try {
      await connect();
      console.log('Connected to test database');
    } catch (error) {
      console.error('Error connecting to test database:', error);
      throw error;
    }
  }, 60000); // 60 second timeout

  // Clear all test data after each test
  afterEach(async () => {
    try {
      await clearDatabase();
    } catch (error) {
      console.error('Error clearing test database:', error);
    }
  });

  // Close the database connection after all tests
  afterAll(async () => {
    try {
      await closeDatabase();
      console.log('Closed test database connection');
    } catch (error) {
      console.error('Error closing test database:', error);
    }
  }, 60000); // 60 second timeout
};
