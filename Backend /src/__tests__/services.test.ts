import request from 'supertest';
import app from '../app';
import { Service } from '../models/Service';

describe('Services API', () => {
  let adminToken: string;

  beforeEach(async () => {
    // Create admin user and get token
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin'
      });
    
    adminToken = response.body.token;
  });

  describe('GET /api/v1/services', () => {
    it('should get all services', async () => {
      // Create test services
      await Service.create([
        {
          title: 'Service 1',
          description: 'Description 1',
          image: 'https://example.com/image1.jpg'
        },
        {
          title: 'Service 2',
          description: 'Description 2',
          image: 'https://example.com/image2.jpg'
        }
      ]);

      const response = await request(app)
        .get('/api/v1/services')
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.results).toBe(2);
      expect(response.body.data.services).toHaveLength(2);
    });

    it('should return empty array when no services exist', async () => {
      const response = await request(app)
        .get('/api/v1/services')
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.results).toBe(0);
      expect(response.body.data.services).toHaveLength(0);
    });
  });

  describe('GET /api/v1/services/:id', () => {
    it('should get a single service by id', async () => {
      const service = await Service.create({
        title: 'Test Service',
        description: 'Test Description',
        image: 'https://example.com/image.jpg'
      });

      const response = await request(app)
        .get(`/api/v1/services/${service._id}`)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.service.title).toBe('Test Service');
    });

    it('should return 404 for non-existent service', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .get(`/api/v1/services/${fakeId}`)
        .expect(404);

      expect(response.body.status).toBe('error');
    });
  });

  describe('POST /api/v1/services', () => {
    it('should create a new service with valid data', async () => {
      const serviceData = {
        title: 'New Service',
        description: 'New Description',
        image: 'https://example.com/new-image.jpg'
      };

      const response = await request(app)
        .post('/api/v1/services')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(serviceData)
        .expect(201);

      expect(response.body.status).toBe('success');
      expect(response.body.data.service.title).toBe(serviceData.title);
    });

    it('should not create service without authentication', async () => {
      const serviceData = {
        title: 'New Service',
        description: 'New Description',
        image: 'https://example.com/new-image.jpg'
      };

      const response = await request(app)
        .post('/api/v1/services')
        .send(serviceData)
        .expect(401);

      expect(response.body.status).toBe('error');
    });

    it('should not create service with missing required fields', async () => {
      const serviceData = {
        title: 'New Service'
        // missing description and image
      };

      const response = await request(app)
        .post('/api/v1/services')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(serviceData)
        .expect(400);

      expect(response.body.status).toBe('error');
    });
  });

  describe('PATCH /api/v1/services/:id', () => {
    it('should update a service', async () => {
      const service = await Service.create({
        title: 'Original Title',
        description: 'Original Description',
        image: 'https://example.com/original.jpg'
      });

      const updateData = {
        title: 'Updated Title'
      };

      const response = await request(app)
        .patch(`/api/v1/services/${service._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.service.title).toBe('Updated Title');
      expect(response.body.data.service.description).toBe('Original Description');
    });
  });

  describe('DELETE /api/v1/services/:id', () => {
    it('should delete a service', async () => {
      const service = await Service.create({
        title: 'Service to Delete',
        description: 'Description',
        image: 'https://example.com/image.jpg'
      });

      await request(app)
        .delete(`/api/v1/services/${service._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(204);

      const deletedService = await Service.findById(service._id);
      expect(deletedService).toBeNull();
    });
  });
});
