import { Router } from "express";
import usersController from "../controllers/usersController";
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

// Route to get all users - accepts filtering parameters via query string
router.get("/", authenticate, usersController.getAll);

// Route to get a specific user by ID
router.get("/:id", authenticate, usersController.getById);

// Route to update a specific user by ID
router.put("/:id", authenticate, usersController.update);

// Route to delete a specific user by ID
router.delete("/:id", authenticate, usersController.delete);

export default router;