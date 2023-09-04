import { Response, NextFunction } from 'express';
import { RequestWithUserId } from './isAuth';
import * as ERROR_MESSAGES from '../constants/error-messages';

export function requireRoles(roles: ('admin' | 'editor' | 'guest')[]) {
  return async (req: RequestWithUserId, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user!.role))
      return res
        .status(401)
        .json({ errors: [ERROR_MESSAGES.PERMISSION_DENIED] });
    next();
  };
}
