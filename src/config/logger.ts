import pino from 'pino';

import env from './env';
import { pinoHttp } from 'pino-http';

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


export const httpLogger = pinoHttp({
  logger,

  customProps: (req, res) => ({
    request: {
      method: req.method,
      url: req.url,
    },
    response: {
      statusCode: res.statusCode,
    },
  }),

  serializers: {
    req: () => undefined,
    res: () => undefined,
  },
});