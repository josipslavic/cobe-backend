import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import 'dotenv/config';
import { RequestWithUserId } from '../interfaces/requestWithUserId';
import { IJwt } from '../interfaces/jwt';
import { commonErrors } from '../constants/commonErrors';

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
    if (error instanceof JsonWebTokenError) error = commonErrors.authFailed;
    next(error);
  }
};
