import pino from 'pino';
import { Request, Response, NextFunction } from 'express';
import env from './env';

export const logger = pino({
  level: env.LOG_LEVEL,
  ...(env.isDevelopment && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    },
  }),
});


export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const start = Date.now();

  res.on('finish', () => {
    const log = {
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      responseTime: Date.now() - start,
    };

    const logLine = `method=${log.method} url=${log.path} status=${log.statusCode} durationMs=${log.responseTime}`;
    
    if (res.statusCode >= 500) {
      logger.error(logLine);
    } else if (res.statusCode >= 400) {
      logger.warn(logLine);
    } else {
      logger.info(logLine);
    }
  });

  next();
};