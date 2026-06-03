import 'dotenv/config';
import 'source-map-support/register';

import app from './app';
import { env, logger, initSentry } from './config';
import { endPool } from '@/db/database';

// Init Sentry before anything else
initSentry();

console.log('Starting server...', process.pid);

const server = app.listen(env.PORT, () => {
  logger.info(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode with process id ${process.pid}`);
  logger.info(`API docs available at http://localhost:${env.PORT}/api-docs`);
});

const shutdown = (signal: string) => {
  logger.info(`${signal} received — shutting down gracefully`);

  server.close( async () => {
    logger.info('HTTP server closed');
    await endPool();
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

process.on('exit', (code) => {
  console.log('Process exiting', process.pid, code);
});

process.on('SIGUSR2', () => {
  console.log('SIGUSR2', process.pid);
  process.exit(0);
});

// ['SIGUSR2', 'SIGTERM', 'SIGINT', 'SIGHUP'].forEach((signal) => {
//   process.on(signal as NodeJS.Signals, () => {
//     console.log(`RECEIVED ${signal}`, process.pid);
//   });
// });

export default server;