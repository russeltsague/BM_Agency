import mongoose from 'mongoose';
import { setupTestDB } from './test-db';

describe('Database Connection', () => {
  setupTestDB();

  it('should connect to the database', async () => {
    const readyState = mongoose.connection.readyState;
    // readyState:
    // 0 = disconnected
    // 1 = connected
    // 2 = connecting
    // 3 = disconnecting
    expect(readyState).toBe(1);
  });

  it('should be able to perform database operations', async () => {
    // Try to create a test collection and insert a document
    const testCollection = mongoose.connection.collection('testcollection');
    
    // Insert a test document
    const insertResult = await testCollection.insertOne({ test: 'value' });
    expect(insertResult.acknowledged).toBe(true);
    expect(insertResult.insertedId).toBeDefined();

    // Find the test document
    const foundDoc = await testCollection.findOne({ _id: insertResult.insertedId });
    expect(foundDoc).toBeDefined();
    expect(foundDoc?.test).toBe('value');
  });
});
