import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../classes/CustomError';

export function errorHandler(
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status = err.statusCode || 500;
  const message = err.message || 'Something went wrong';
  res.status(status).json({
    success: false,
    statusCode: status,
    message: message,
  });
}
