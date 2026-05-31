import swaggerUi from "swagger-ui-express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";

import { env, requestLogger } from "@/config";
import { requestId, rateLimiter } from "@/middlewares";
import { swaggerSpec } from "@/docs/swagger";

import type { Express } from "express";

const configureMiddleware = (app: Express): void => {
    app.use(helmet());
    app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));

    app.use(compression());

    app.use(requestId);
    app.use(requestLogger);

    app.use(rateLimiter);

    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default configureMiddleware;
