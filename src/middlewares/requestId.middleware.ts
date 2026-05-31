import type { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

const requestId = (req: Request, _res: Response, next: NextFunction): void => {
    req.requestId = randomUUID();
    next();
};

export default requestId;