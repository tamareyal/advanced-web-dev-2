import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
    userId?: string;
}

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token missing' });
    }

    const secretKey: jwt.Secret = process.env.JWT_SECRET || 'defaultSecretKey';

    try {
        const decoded = jwt.verify(token, secretKey) as { userId: string };
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};