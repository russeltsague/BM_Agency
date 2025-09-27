import request from 'supertest';
import app from '../app';
import { Article } from '../models/Article';
import { setupTestDB } from './test-db';

// Setup test database
setupTestDB();

describe('Articles API', () => {
  let adminToken: string;
  let editorToken: string;
  let articleId: string;

  const articleData = {
    title: 'Test Article',
    content: 'This is a test article content',
    excerpt: 'Test excerpt',
    image: 'https://example.com/image.jpg',
    category: 'Technology',
    tags: ['test', 'article']
  };

  beforeAll(async () => {
    // Create admin user
    const adminResponse = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Admin User',
        email: 'admin@test.com',
        password: 'password123',
        passwordConfirm: 'password123',
        role: 'admin'
      });
    adminToken = `Bearer ${adminResponse.body.token}`;

    // Create editor user
    const editorResponse = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Editor User',
        email: 'editor@test.com',
        password: 'password123',
        passwordConfirm: 'password123',
        role: 'editor'
      });
    editorToken = `Bearer ${editorResponse.body.token}`;
  }, 30000);

  describe('POST /api/v1/articles', () => {
    it('should create a new article (admin or editor)', async () => {
      const response = await request(app)
        .post('/api/v1/articles')
        .set('Authorization', editorToken)
        .send(articleData)
        .expect(201);

      expect(response.body.status).toBe('success');
      expect(response.body.data.article.title).toBe(articleData.title);
      
      articleId = response.body.data.article._id;
    });

    it('should return 403 if not admin or editor', async () => {
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
        .post('/api/v1/articles')
        .set('Authorization', `Bearer ${token}`)
        .send(articleData)
        .expect(403);
    });
  });

  describe('GET /api/v1/articles', () => {
    it('should get all articles', async () => {
      // Create a test article
      await Article.create(articleData);

      const response = await request(app)
        .get('/api/v1/articles')
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.results).toBeGreaterThan(0);
      expect(Array.isArray(response.body.data.articles)).toBe(true);
    });

    it('should filter articles by category', async () => {
      await Article.create(articleData);
      
      const response = await request(app)
        .get('/api/v1/articles?category=Technology')
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.articles[0].category).toBe('Technology');
    });
  });

  describe('GET /api/v1/articles/:id', () => {
    it('should get an article by ID', async () => {
      const article = await Article.create({
        ...articleData,
        title: 'Test Article for ID'
      });
      
      const response = await request(app)
        .get(`/api/v1/articles/${article._id}`)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.article.title).toBe('Test Article for ID');
    });
  });

  describe('PATCH /api/v1/articles/:id', () => {
    it('should update an article (admin or editor)', async () => {
      const article = await Article.create(articleData);
      
      const updatedData = {
        title: 'Updated Article',
        content: 'This is an updated article',
      };

      const response = await request(app)
        .patch(`/api/v1/articles/${article._id}`)
        .set('Authorization', editorToken)
        .send(updatedData)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.article.title).toBe(updatedData.title);
    });
  });

  describe('DELETE /api/v1/articles/:id', () => {
    it('should delete an article (admin or editor)', async () => {
      const article = await Article.create(articleData);
      
      await request(app)
        .delete(`/api/v1/articles/${article._id}`)
        .set('Authorization', adminToken)
        .expect(204);

      // Verify article is deleted
      const deletedArticle = await Article.findById(article._id);
      expect(deletedArticle).toBeNull();
    });
  });
});
