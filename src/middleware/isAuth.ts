import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import 'dotenv/config';
import * as ERROR_MESSAGES from '../constants/error-messages';
import { RequestWithUserId } from '../interfaces/requestWithUserId';
import { IJwt } from '../interfaces/jwt';

export const isAuth = (
  req: RequestWithUserId,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization || '';
    const decoded = jwt.verify(token, process.env.JWT_KEY as string) as IJwt;
    req.user = {
      id: decoded.id,
      role: decoded.role,
      alias: decoded.alias,
      fullName: decoded.fullName,
    };
    next();
  } catch (error) {
    return res.status(401).json({
      errors: [ERROR_MESSAGES.AUTH_FAILED],
    });
  }
};
