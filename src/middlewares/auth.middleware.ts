import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { env } from '@/config';
import ApiError from '@/utils/ApiError';
import httpStatus from '@/constants/httpStatus';

// if you want to use brearer token

// const authMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
//     const authHeader = req.headers.authorization;

//     if (!authHeader?.startsWith('Bearer ')) {
//         throw new ApiError(httpStatus.UNAUTHORIZED, 'No token provided');
//     }

//     const token = authHeader.split(' ')[1];

//     try {
//         const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
//         req.user = decoded as Request['user'];
//         next();
//     } catch {
//         throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid or expired token');
//     }
// };


// if you want to use cookies

const authMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
    const token = req.cookies?.accessToken;

    if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'No token provided');
    }

    try {
        const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
        req.user = decoded as Request['user'];
        next();
    } catch {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid or expired token');
    }
};

export default authMiddleware;