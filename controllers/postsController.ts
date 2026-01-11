import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { Request, Response } from 'express';
import PostsModel, { Post } from '../models/posts';
import BaseController from './baseController';

class PostsController extends BaseController<Post> {
    constructor() {
        super(PostsModel);
    }

    create = async (req: AuthenticatedRequest, res: Response) => {
        const authReq = req;
        const body = req.body;
        const senderId = authReq.userId;
        if (!senderId) {
            res.status(401).json({ message: 'Unauthenticated' });
        }
        body.sender_id = senderId;

        try {
            const data = await this.model.create(body);
            res.status(201).json(data);
        } catch (error) {
            res.status(400).json({ message: error instanceof Error ? error.message : "Error" });
        }
    }

}

export default new PostsController();