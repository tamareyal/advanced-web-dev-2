import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import mongoose, { Model } from "mongoose";



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

// Generic owner-check middleware
export const authorizeOwner = <T>(
    model: Model<T>,          // Mongoose model
    getOwner: (resource: T) => mongoose.Types.ObjectId | string        // Field in the model that stores the userId
    ) => {
        return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            const resourceId = req.params.id;
            const userId = req.userId;

            if(!userId) {
                return res.status(400).json({ message: 'Unauthenticated' });
            }

            try {
                const resource = await model.findById(resourceId);
                if (!resource) {
                    return res.status(404).json({ message: 'Resource not found' });
                }
                if (getOwner(resource).toString() !== userId) {
                    return res.status(403).json({ message: 'Forbidden: unable to perform operation on resource not owned by you' });
                }
                next();
            } catch (error) {
                res.status(500).json({ message: error instanceof Error ? error.message : "Error" });
            }
        };
};