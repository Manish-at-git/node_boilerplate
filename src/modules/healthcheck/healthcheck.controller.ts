import type { Request, Response } from 'express';
import { buildQuery, execute } from '@/db/database';
import { logger } from '@/config';

const health = (_req: Request, res: Response): void => {
    res.json({ success: true, message: 'OK' });
};

const dbHealth = async (_req: Request, res: Response): Promise<void> => {
    const { text, values } = buildQuery(`SELECT id, created_at FROM demo_table LIMIT :limit`, { limit: 1 })
    await execute(text, values);
    res.json({ success: true, message: 'OK' });
};

const authTest = async (_req: Request, res: Response): Promise<void> => {
    const { text, values } = buildQuery(`SELECT id, created_at FROM demo_table LIMIT :limit`, { limit: 1 })
    await execute(text, values);
    res.json({ success: true, message: 'OK' });
};

const authorizationTest = async (_req: Request, res: Response): Promise<void> => {
    res.json({ success: true, message: 'OK' });
};

export default { health, dbHealth, authTest, authorizationTest };