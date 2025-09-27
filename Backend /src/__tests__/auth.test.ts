import request from 'supertest';
import app from '../app';
import { setupTestDB } from './test-db';

// Setup test database
setupTestDB();

const userData = {
  name: 'Test User',
  email: 'test@test.com',
  password: 'password123',
  passwordConfirm: 'password123',
};

describe('Auth API', () => {
  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.status).toBe('success');
      expect(response.body.token).toBeDefined();
      expect(response.body.data.user.email).toBe(userData.email);
    });

    it('should return 400 if email is invalid', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({ ...userData, email: 'invalid-email' })
        .expect(400);

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toContain('Please provide a valid email');
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/v1/auth/register').send(userData);
    });

    it('should login a user with valid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: userData.email, password: userData.password })
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.token).toBeDefined();
    });

    it('should return 401 with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: userData.email, password: 'wrongpassword' })
        .expect(401);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toContain('Incorrect email or password');
    });
  });

  describe('Authenticated routes', () => {
    let token: string;

    beforeAll(async () => {
      const registerResponse = await request(app)
        .post('/api/v1/auth/register')
        .send(userData);
      token = registerResponse.body.token;
    });

    describe('GET /api/v1/auth/me', () => {
      it('should get current user profile', async () => {
        const response = await request(app)
          .get('/api/v1/auth/me')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);

        expect(response.body.status).toBe('success');
        expect(response.body.data.user.email).toBe(userData.email);
      });

      it('should return 401 if not authenticated', async () => {
        await request(app).get('/api/v1/auth/me').expect(401);
      });
    });

    describe('PATCH /api/v1/auth/update-password', () => {
      it('should update user password', async () => {
        await request(app)
          .patch('/api/v1/auth/update-password')
          .set('Authorization', `Bearer ${token}`)
          .send({ currentPassword: 'password123', newPassword: 'newpassword123' })
          .expect(200);

        // Try to login with new password
        const loginResponse = await request(app)
          .post('/api/v1/auth/login')
          .send({ email: userData.email, password: 'newpassword123' });

        expect(loginResponse.status).toBe(200);
      });

      it('should return 401 if current password is incorrect', async () => {
        const response = await request(app)
          .patch('/api/v1/auth/update-password')
          .set('Authorization', `Bearer ${token}`)
          .send({ currentPassword: 'wrongpassword', newPassword: 'newpassword123' })
          .expect(401);

        expect(response.body.message).toContain('Your current password is incorrect');
      });
    });
  });
});
