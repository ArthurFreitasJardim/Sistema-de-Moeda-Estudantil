import { Router } from "express";

import { AuthController } from "../controllers/AuthController.js";

const router = Router();
const authController = new AuthController();

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/recover-password', authController.requestPasswordReset);
router.post('/reset-password', authController.resetPassword);

export { router as AuthRoutes }