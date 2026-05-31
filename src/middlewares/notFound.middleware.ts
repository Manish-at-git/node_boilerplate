import type { Request, Response, NextFunction } from 'express';

import ApiError from '@/utils/ApiError';
import httpStatus from '@/constants/httpStatus';

const notFound = (req: Request, _res: Response, next: NextFunction): void => {
    next(new ApiError(httpStatus.NOT_FOUND, `Route ${req.originalUrl} not found`));
};

export default notFound;