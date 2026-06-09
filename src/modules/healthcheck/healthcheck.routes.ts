import { Router } from 'express';

import healthController from './healthcheck.controller';
import { authMiddleware } from '@/middlewares';
import authorize from '@/middlewares/authorize.middleware';
import { misc } from '@/constants';

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
 * /api/health/auth_test:
 *   get:
 *     tags:
 *       - Health
 *     summary: Auth test
 *     responses:
 *       200:
 *         description: Auth test success
 */
router.get('/auth_test', authMiddleware, healthController.authTest);


/**
 * @swagger
 * /api/health/authorization_test:
 *   get:
 *     tags:
 *       - Health
 *     summary: Authorization test
 *     responses:
 *       200:
 *         description: Authorization test success
 */

router.get('/authorization_test', authMiddleware, authorize([misc.roles.ADMIN]), healthController.authTest);

export default router;