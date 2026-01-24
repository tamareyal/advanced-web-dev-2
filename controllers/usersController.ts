import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import UserModel, { User } from '../models/users';
import BaseController from './baseController';

class UsersController extends BaseController<User> {
    constructor() {
        super(UserModel);
    }

    update = async (req: Request, res: Response) => {
        const id = req.params.id;
        const body = req.body;

        if (body.password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(body.password, salt);
            body.password = hashedPassword;
        }
        
        try {
            const data = await this.model.findByIdAndUpdate(id, body, { new: true });
            if (!data) {
                return res.status(404).json({ message: "Resource not found" });
            }
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ message: error instanceof Error ? error.message : "Error" });
        }
    };
}

export default new UsersController();