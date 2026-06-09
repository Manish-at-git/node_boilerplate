import { Router } from "express";

import { authMiddleware, validate } from "@/middlewares";
import { registerSchema, loginSchema } from "./auth.schema";
import authController from "./auth.controller";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/refresh", authMiddleware, authController.refresh);

router.post( "/logout", authController.logout );
export default router;
