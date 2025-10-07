import request from 'supertest';
import app from '../app';

describe('Health Check', () => {
  it('should return 200 and health status', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body).toHaveProperty('status');
    expect(response.body).toHaveProperty('message');
  });
});

describe('404 Handler', () => {
  it('should return 404 for non-existent routes', async () => {
    const response = await request(app)
      .get('/api/v1/nonexistent')
      .expect(404);

    expect(response.body.status).toBe('fail');
    expect(response.body.message).toContain("Can't find");
  });
});
