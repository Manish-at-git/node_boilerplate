import swaggerUi from 'swagger-ui-express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';

import { env, requestLogger } from '@/config';
import { errorHandler, notFound, requestId, rateLimiter } from '@/middlewares';
import { swaggerSpec } from '@/docs/swagger';

import type { Express } from 'express';

const   configureMiddleware = (app: Express): void => {

    // ── Security ────────────────────────────────────
    app.use(helmet());
    app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));

    // ── Request parsing ─────────────────────────────
    app.use(compression());

    // ── Logging & request ID ────────────────────────
    app.use(requestId);
    app.use(requestLogger);

    // ── Rate limiting ───────────────────────────────
    app.use(rateLimiter);

    // ── API Docs ────────────────────────────────────
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


};

export default configureMiddleware;