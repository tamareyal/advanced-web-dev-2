import { Router } from "express";
import usersController from "../controllers/usersController";

const router = Router();

// Route to get all users - accepts filtering parameters via query string
router.get("/", usersController.getAll);

// Route to create a new user
router.post("/", usersController.create);

// Route to get a specific user by ID
router.get("/:id", usersController.getById);

// Route to update a specific user by ID
router.put("/:id", usersController.update);

// Route to delete a specific user by ID
router.delete("/:id", usersController.delete);

export default router;