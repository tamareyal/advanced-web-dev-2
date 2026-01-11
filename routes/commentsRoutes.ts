import { Router } from "express";
import commentsController from "../controllers/commentsController";
import { authenticate, authorizeOwner} from '../middlewares/authMiddleware';
import CommentsModel from "../models/comments";

const router = Router();

// Route to get all comments - accepts filtering parameters via query string
router.get("/", authenticate, commentsController.getAll);

// Route to create a new comment
router.post("/", authenticate, commentsController.create);

// Route to get a specific comment by ID
router.get("/:id", authenticate, commentsController.getById);

// Route to get a specific comment by post ID
router.get("/posts/:postId", authenticate, commentsController.getByPostId);

// Route to update a specific comment by ID
router.put("/:id", authenticate, authorizeOwner(CommentsModel, comment => comment.sender_id.toString()), commentsController.update);

// Route to delete a specific comment by ID
router.delete("/:id", authenticate, authorizeOwner(CommentsModel, comment => comment.sender_id.toString()), commentsController.delete);

export default router;