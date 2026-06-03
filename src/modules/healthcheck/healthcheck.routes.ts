import { Router } from 'express';

import healthController from './healthcheck.controller';
import { authMiddleware } from '@/middlewares';

const router = Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     tags:
 *       - Health
 *     summary: Health check
 *     responses:
 *       200:
 *         description: Server is healthy
 */
router.get('/', healthController.health);

/**
 * @swagger
 * /api/health/db:
 *   get:
 *     tags:
 *       - Health
 *     summary: Health check DB
 *     responses:
 *       200:
 *         description: Database is healthy
 */
router.get('/db', healthController.dbHealth);

/**
 * @swagger
 * /api/health//auth_test:
 *   get:
 *     tags:
 *       - Health
 *     summary: Auth test
 *     responses:
 *       200:
 *         description: Auth test success
 */
router.get('/auth_test', authMiddleware, healthController.authTest);

export default router;