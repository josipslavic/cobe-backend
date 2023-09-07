import { Response, NextFunction } from 'express';
import { RequestWithUserId } from '../interfaces/requestWithUserId';
import { UserRoles } from '../enums/UserRoles';
import * as ERROR_MESSAGES from '../constants/error-messages';

export function requireRoles(roles: UserRoles[]) {
  return async (req: RequestWithUserId, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user!.role))
      return res
        .status(401)
        .json({ errors: [ERROR_MESSAGES.PERMISSION_DENIED] });
    next();
  };
}
