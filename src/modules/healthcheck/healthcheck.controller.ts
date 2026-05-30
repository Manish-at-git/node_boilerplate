import type { Request, Response } from 'express';

import pool from '@/db';

const health = (_req: Request, res: Response): void => {
  res.json({ success: true, message: 'OK' });
};

const dbHealth = async (_req: Request, res: Response): Promise<void> => {
  try {
    await pool.query('SELECT 1');
    res.json({ success: true, message: 'DB connection OK' });
  } catch {
    res.status(500).json({ success: false, message: 'DB connection failed' });
  }
};

export default { health, dbHealth };