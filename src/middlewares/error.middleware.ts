import type { Request, Response, NextFunction } from 'express';
import * as Sentry from '@sentry/node';

import { logger, env } from '@/config';
import ApiError from '@/utils/ApiError';
import httpStatus from '@/constants/httpStatus';

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  // Send to Sentry if not an operational error
  if (!(err instanceof ApiError) || !err.isOperational) {
    Sentry.captureException(err);
  }

  const statusCode = err instanceof ApiError ? err.statusCode : httpStatus.INTERNAL_SERVER_ERROR;
  const message = err instanceof ApiError ? err.message : 'Internal server error';

  logger.error({ requestId: req.requestId, err, statusCode }, message);

  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
    ...(env.isDevelopment && { stack: err.stack }),
  });
};

export default errorHandler;