import PostsModel, { Post } from '../models/posts';
import BaseController from './baseController';

class PostsController extends BaseController<Post> {
    constructor() {
        super(PostsModel);
    }
}

export default new PostsController();