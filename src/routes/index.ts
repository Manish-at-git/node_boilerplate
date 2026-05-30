import { Router } from 'express';
import { healthRoutes } from '@/modules/healthcheck';
import v1Router from './v1';

const router = Router();

router.use('/health', healthRoutes);
router.use('/v1', v1Router);


export default router;