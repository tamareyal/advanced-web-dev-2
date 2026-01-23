import { Router } from "express";
import commentsController from "../controllers/commentsController";
import { authenticate, authorizeOwner} from '../middlewares/authMiddleware';
import CommentsModel from "../models/comments";

const router = Router();

// Route to get all comments - accepts filtering parameters via query string
/**
 * @swagger
 * /api/comments:
 *   get:
 *     tags:
 *       - Comments
 *     summary: Retrieve a list of comments
 *     description: Retrieve a list of comments. Can be filtered by query parameters.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of comments.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       401:
 *         description: Unauthorized
 */
router.get("/", authenticate, commentsController.getAll);

// Route to create a new comment
/**
 * @swagger
 * /api/comments:
 *   post:
 *     tags:
 *       - Comments
 *     summary: Create a new comment
 *     description: Create a new comment. The sender_id is set automatically based on the authenticated user.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               post_id:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post("/", authenticate, commentsController.create);

// Route to get a specific comment by ID
/**
 * @swagger
 * /api/comments/{id}:
 *   get:
 *     tags:
 *       - Comments
 *     summary: Retrieve a specific comment by ID
 *     description: Retrieve a specific comment by its ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The comment ID.
 *     responses:
 *       200:
 *         description: A single comment.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Comment not found
 */  
router.get("/:id", authenticate, commentsController.getById);

// Route to get a specific comment by post ID
/**
 * @swagger
 * /api/comments/posts/{postId}:
 *   get:
 *     tags:
 *       - Comments
 *     summary: Retrieve comments for a specific post by post ID
 *     description: Retrieve comments associated with a specific post by its ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID.
 *     responses:
 *       200:
 *         description: A list of comments for the specified post.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 */
router.get("/posts/:postId", authenticate, commentsController.getByPostId);

// Route to update a specific comment by ID
/**
 * @swagger
 * /api/comments/{id}:
 *   put:
 *     tags:
 *       - Comments
 *     summary: Update a specific comment by ID
 *     description: Update a specific comment by its ID. Only the sender of the comment can update it.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The comment ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Comment not found
 */
router.put("/:id", authenticate, authorizeOwner(CommentsModel, comment => comment.sender_id.toString()), commentsController.update);

// Route to delete a specific comment by ID
/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     tags:
 *       - Comments
 *     summary: Delete a specific comment by ID
 *     description: Delete a specific comment by its ID. Only the sender of the comment can delete it.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The comment ID.
 *     responses:
 *       200:
 *         description: Comment deleted successfully.
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Comment not found
 */
router.delete("/:id", authenticate, authorizeOwner(CommentsModel, comment => comment.sender_id.toString()), commentsController.delete);

export default router;