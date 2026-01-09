import UserModel, { User } from '../models/users';
import BaseController from './baseController';

class UsersController extends BaseController<User> {
    constructor() {
        super(UserModel);
    }
}

export default new UsersController();