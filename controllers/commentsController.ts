import CommentsModel, { Comment } from '../models/comments';
import BaseController from './baseController';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

class CommentsController extends BaseController<Comment> {
    constructor() {
        super(CommentsModel);
    }
    
    getByPostId = async (req: Request<{ postId: string }>, res: Response) => {
        const { postId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Invalid postId' });
        }
        try {
            const data = await CommentsModel.find({ post_id: new mongoose.Types.ObjectId(postId) });
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ message: error instanceof Error ? error.message : "Error" });
        }
    }
}

export default new CommentsController();