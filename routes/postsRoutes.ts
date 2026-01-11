import { Router } from "express";
import postsController from "../controllers/postsController";
import { authenticate, authorizeOwner } from '../middlewares/authMiddleware';
import PostsModel from "../models/posts";

const router = Router();

// Route to get all posts - accepts filtering parameters via query string
router.get("/", authenticate, postsController.getAll);

// Route to create a new post
router.post("/", authenticate, postsController.create);

// Route to get a specific post by ID
router.get("/:id", authenticate, postsController.getById);

// Route to update a specific post by ID
router.put("/:id", authenticate, authorizeOwner(PostsModel, post => post.sender_id.toString()), postsController.update);

// Route to delete a specific post by ID
router.delete("/:id", authenticate, authorizeOwner(PostsModel, post => post.sender_id.toString()), postsController.delete);

export default router;