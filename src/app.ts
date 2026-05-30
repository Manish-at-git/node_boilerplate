import 'express-async-errors';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import pinoHttp from 'pino-http';
import swaggerUi from 'swagger-ui-express';
import sanitizeHtml from 'sanitize-html';

import { logger, env } from '@/config';
import router from '@/routes';
import { errorHandler, notFound, requestId, rateLimiter } from '@/middlewares';

const app = express();

// ── Security ────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));

// ── Request parsing ─────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// ── Sanitize request body ───────────────────────
app.use((req, _res, next) => {
  if (req.body) {
    req.body = JSON.parse(sanitizeHtml(JSON.stringify(req.body)));
  }
  next();
});

// ── Logging & request ID ────────────────────────
app.use(pinoHttp({ logger }));
app.use(requestId);

// ── Rate limiting ───────────────────────────────
app.use(rateLimiter);

// ── API Docs ────────────────────────────────────
// if (!env.isProduction) {
//   app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// }

// ── Routes ──────────────────────────────────────
app.use('/api', router);

// ── 404 & Error handlers ────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;