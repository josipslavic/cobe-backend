import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import 'dotenv/config';

export interface RequestWithUserId extends Request {
  user?: {
    id: string;
    role: 'admin' | 'editor' | 'guest';
    alias: string;
    fullName?: string;
  };
}

export const isAuth = (
  req: RequestWithUserId,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization || '';
    const decoded = jwt.verify(token, process.env.JWT_KEY as string) as {
      id: string;
      role: 'admin' | 'editor' | 'guest';
      alias: string;
      fullName?: string;
    };
    req.user = {
      id: decoded.id,
      role: decoded.role,
      alias: decoded.alias,
      fullName: decoded.fullName,
    };
    next();
  } catch (error) {
    return res.status(401).json({
      errors: ['auth failed'],
    });
  }
};
