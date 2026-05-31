import type { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';

import ApiError from '@/utils/ApiError';
import httpStatus from '@/constants/httpStatus';

const rateLimiter = new RateLimiterMemory({
    points: 100,      // requests
    duration: 60,     // per 60 seconds
});

const rateLimiterMiddleware = async (
    req: Request,
    _res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        await rateLimiter.consume(req.ip ?? 'unknown');
        next();
    } catch {
        throw new ApiError(httpStatus.TOO_MANY_REQUESTS, 'Too many requests');
    }
};

export default rateLimiterMiddleware;