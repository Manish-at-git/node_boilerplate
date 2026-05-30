import 'dotenv/config';
import 'source-map-support/register';

import app from './app';
import { env, logger, initSentry } from './config';

// Init Sentry before anything else
initSentry();

const server = app.listen(env.PORT, () => {
  logger.info(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  // logger.info(`API docs available at http://localhost:${env.PORT}/api-docs`);
});

// ── Graceful shutdown ────────────────────────────
const shutdown = (signal: string) => {
  logger.info(`${signal} received — shutting down gracefully`);

  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });

  // Force exit if server hasn't closed in 10s
  setTimeout(() => {
    logger.error('Forcing shutdown after timeout');
    process.exit(1);
  }, 10_000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  logger.error({ reason }, 'Unhandled rejection');
  shutdown('unhandledRejection');
});

process.on('uncaughtException', (err) => {
  logger.fatal({ err }, 'Uncaught exception');
  process.exit(1);
});

export default server;