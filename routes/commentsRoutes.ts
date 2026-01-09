import { Router } from "express";
import commentsController from "../controllers/commentsController";

const router = Router();

// Route to get all comments - accepts filtering parameters via query string
router.get("/", commentsController.getAll);

// Route to create a new comment
router.post("/", commentsController.create);

// Route to get a specific comment by ID
router.get("/:id", commentsController.getById);

// Route to get a specific comment by post ID
router.get("/posts/:postId", commentsController.getByPostId);

// Route to update a specific comment by ID
router.put("/:id", commentsController.update);

// Route to delete a specific comment by ID
router.delete("/:id", commentsController.delete);

export default router;