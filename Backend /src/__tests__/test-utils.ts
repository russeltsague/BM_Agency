import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import request from 'supertest';
import { app } from '../app';

/**
 * Helper function to create a test user and get an auth token
 */
export const createTestUser = async (userData: {
  name?: string;
  email: string;
  password?: string;
  role?: string;
}) => {
  const response = await request(app)
    .post('/api/v1/auth/register')
    .send({
      name: userData.name || 'Test User',
      email: userData.email,
      password: userData.password || 'password123',
      passwordConfirm: userData.password || 'password123',
      role: userData.role || 'user'
    });

  return {
    token: `Bearer ${response.body.token}`,
    user: response.body.data.user
  };
};

/**
 * Helper function to get an auth token for an existing user
 */
export const getAuthToken = async (email: string, password: string) => {
  const response = await request(app)
    .post('/api/v1/auth/login')
    .send({
      email,
      password
    });

  return `Bearer ${response.body.token}`;
};
