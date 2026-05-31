import { Router } from 'express';

import healthController from './healthcheck.controller';

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

export default router;