import { Router } from 'express';

// import authRoutes from '@/modules/auth/auth.routes';  // uncomment when ready

const v1Router = Router();

v1Router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'OK' });
});

// v1Router.use('/auth', authRoutes);  // uncomment when ready

export default v1Router;