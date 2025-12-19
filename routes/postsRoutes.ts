import { Router } from "express";
import postsController from "../controllers/postsController";

const router = Router();

// Route to get all posts - accepts filtering parameters via query string
router.get("/", postsController.getAll);

// Route to create a new post
router.post("/", postsController.create);

// Route to get a specific post by ID
router.get("/:id", postsController.getById);

// Route to update a specific post by ID
router.put("/:id", postsController.update);

// Route to delete a specific post by ID
router.delete("/:id", postsController.delete);

export default router;