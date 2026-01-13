import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import UserModel from '../models/users';


const generateToken = (userId: string): { token: string; refreshToken: string } => {
    const secretKey: jwt.Secret = process.env.JWT_SECRET  || 'defaultSecretKey';
    const tokenExp: number = Number(process.env.JWT_EXPIRES_IN)  || 3000;
    const refTokenExp: number = Number(process.env.REFRESH_TOKEN_EXPIRES_IN) || 86400;

    const token = jwt.sign({ userId: userId, tokenType: 'access', nonce: Math.random().toString(36).substring(2, 15) }, secretKey, { expiresIn: tokenExp });
    const refreshToken = jwt.sign({ userId: userId, tokenType: 'refresh', nonce: Math.random().toString(36).substring(2, 15) }, secretKey, { expiresIn: refTokenExp });

    return { token, refreshToken };
}


const register = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await UserModel.create({
                name: username,
                email,
                password: hashedPassword,
                refreshTokens: []
            });
        const tokens = generateToken(user._id.toString());
        user.refreshTokens.push(tokens.refreshToken);
        await user.save();
        return res.status(201).json({ ...tokens, userId: user._id.toString() });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
}


const login = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    if ((!username && !email) || !password) {
        return res.status(400).json({ message: 'Username or email and password are required' });
    }

    try {
        const query = email
            ? { email }
            : { name: username };

        const user = await UserModel.findOne(query);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const tokens = generateToken(user._id.toString());
        user.refreshTokens.push(tokens.refreshToken);
        await user.save();
        return res.status(200).json({ ...tokens, userId: user._id.toString() });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
}

const refreshToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token is required' });
    }
    
    try {
        const secretKey: jwt.Secret = process.env.JWT_SECRET  || 'defaultSecretKey';
        const decoded: jwt.JwtPayload = jwt.verify(refreshToken, secretKey) as jwt.JwtPayload;
        const userId = decoded.userId;
        
        const user = await UserModel.findById(userId);
        if (!user)
            return res.status(401).json({ message: 'Invalid refresh token' })
        if (!user.refreshTokens.includes(refreshToken)) {
            user.refreshTokens = [];
            await user.save();
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        const tokens = generateToken(user._id.toString());
        user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);
        user.refreshTokens.push(tokens.refreshToken);
        await user.save();
        return res.status(200).json({ ...tokens, userId: user._id.toString() });
    }
    catch (error) {
        console.error('Error in refreshToken:', error);
        return res.status(500).json({ message: 'Server error', error });
    }
}

export default {
    register,
    login,
    refreshToken
};
