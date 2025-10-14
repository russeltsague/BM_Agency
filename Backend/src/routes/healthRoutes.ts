import { Router } from 'express';
import { healthCheck, readinessCheck, livenessCheck } from '../controllers/healthController';

const router = Router();

/**
 * @swagger
 * /api/v1/health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *       503:
 *         description: Service is unhealthy
 */
router.get('/health', healthCheck);

/**
 * @swagger
 * /api/v1/ready:
 *   get:
 *     summary: Readiness check for orchestration systems
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is ready
 *       503:
 *         description: Service is not ready
 */
router.get('/ready', readinessCheck);

/**
 * @swagger
 * /api/v1/live:
 *   get:
 *     summary: Liveness check for orchestration systems
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is alive
 */
router.get('/live', livenessCheck);

export default router;
