import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import 'dotenv/config';
import { AUTH_FAILED } from '../constants/error-messages';

export interface RequestWithUserId extends Request {
  // TODO: Extract interfaces into interfaces folder
  user?: {
    id: string;
    role: 'admin' | 'editor' | 'guest'; // TODO: Extract roles into enum so they can be easily manipulated
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
      // TODO: Define this as an interface
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
      errors: [AUTH_FAILED],
    });
  }
};
