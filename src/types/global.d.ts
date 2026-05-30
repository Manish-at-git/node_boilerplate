declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PORT: string;
      JWT_SECRET: string;
      REDIS_HOST: string;
      REDIS_PORT: string;
      LOG_LEVEL: string;
      SENTRY_DSN: string;
      CORS_ORIGIN: string;
    }
  }
}

export {};