import { Router } from "express";
import authController from "../controllers/authController";

const router = Router();


// Route to register as a new user
router.post("/register", authController.register);

// Route to login as an existing user
router.post("/login", authController.login);

// Route to refresh tokens
router.post("/refresh-token", authController.refreshToken);

export default router;