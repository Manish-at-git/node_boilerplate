import "express-async-errors";
import express from "express";
import router from "@/routes";
import configureMiddleware from "./config/middleware";
import { errorHandler, notFound } from "./middlewares";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

configureMiddleware(app);

app.use("/api", router);

app.use(notFound);
app.use(errorHandler);

export default app;
