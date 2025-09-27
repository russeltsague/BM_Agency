import request from 'supertest';
import app from '../app';
import { Service } from '../models/Service';
import { setupTestDB } from './test-db';
import mongoose from 'mongoose';

// Setup test database
setupTestDB();

describe('Services API', () => {
  let adminToken: string;
  let serviceId: string;

  const serviceData = {
    title: 'Test Service',
    description: 'This is a test service',
    image: 'https://example.com/image.jpg',
  };

  beforeAll(async () => {
    // Create admin user and get token
    const registerResponse = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Admin User',
        email: 'admin@test.com',
        password: 'password123',
        passwordConfirm: 'password123',
        role: 'admin'
      });
    
    adminToken = `Bearer ${registerResponse.body.token}`;
  }, 30000);

  describe('POST /api/v1/services', () => {
    it('should create a new service (admin only)', async () => {
      const response = await request(app)
        .post('/api/v1/services')
        .set('Authorization', adminToken)
        .send(serviceData)
        .expect(201);

      expect(response.body.status).toBe('success');
      expect(response.body.data.service.title).toBe(serviceData.title);
      
      serviceId = response.body.data.service._id;
    });

    it('should return 401 if not authenticated', async () => {
      await request(app)
        .post('/api/v1/services')
        .send(serviceData)
        .expect(401);
    });

    it('should return 403 if not admin', async () => {
      // Register a regular user
      const registerResponse = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Regular User',
          email: 'user@test.com',
          password: 'password123',
          passwordConfirm: 'password123'
        });
      
      const token = registerResponse.body.token;
      
      await request(app)
        .post('/api/v1/services')
        .set('Authorization', `Bearer ${token}`)
        .send(serviceData)
        .expect(403);
    });
  });

  describe('GET /api/v1/services', () => {
    it('should get all services', async () => {
      // Create a test service
      await Service.create(serviceData);

      const response = await request(app)
        .get('/api/v1/services')
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.results).toBeGreaterThan(0);
      expect(Array.isArray(response.body.data.services)).toBe(true);
    });
  });

  describe('GET /api/v1/services/:id', () => {
    it('should get a service by ID', async () => {
      const service = await Service.create(serviceData);
      
      const response = await request(app)
        .get(`/api/v1/services/${service._id}`)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.service.title).toBe(serviceData.title);
    });

    it('should return 404 if service not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      await request(app)
        .get(`/api/v1/services/${nonExistentId}`)
        .expect(404);
    });
  });

  describe('PATCH /api/v1/services/:id', () => {
    it('should update a service (admin only)', async () => {
      const service = await Service.create(serviceData);
      
      const updatedData = {
        title: 'Updated Service',
        description: 'This is an updated service',
      };

      const response = await request(app)
        .patch(`/api/v1/services/${service._id}`)
        .set('Authorization', adminToken)
        .send(updatedData)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.service.title).toBe(updatedData.title);
    });
  });

  describe('DELETE /api/v1/services/:id', () => {
    it('should delete a service (admin only)', async () => {
      const service = await Service.create(serviceData);
      
      await request(app)
        .delete(`/api/v1/services/${service._id}`)
        .set('Authorization', adminToken)
        .expect(204);

      // Verify service is deleted
      const deletedService = await Service.findById(service._id);
      expect(deletedService).toBeNull();
    });
  });
});
