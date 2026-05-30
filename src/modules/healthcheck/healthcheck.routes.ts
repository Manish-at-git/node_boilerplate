import { Router } from 'express';

import healthController from './healthcheck.controller';

const router = Router();

router.get('/', healthController.health);
router.get('/db', healthController.dbHealth);

export default router;