import { cleanEnv, str, port, num } from 'envalid';

const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'production', 'test'] }),
  PORT: port({ default: 8080 }),

  DATABASE_URL: str(),

  JWT_SECRET: str(),

  REDIS_HOST: str({ default: 'redis' }),
  REDIS_PORT: num({ default: 6379 }),

  LOG_LEVEL: str({ default: 'info' }),

  SENTRY_DSN: str({ default: '' }),

  CORS_ORIGIN: str({ default: 'http://localhost:3000' }),
});

export default env;