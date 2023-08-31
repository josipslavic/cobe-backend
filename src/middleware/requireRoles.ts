import { Response, NextFunction } from 'express';
import { RequestWithUserId } from '../interfaces/requestWithUserId';
import { userRoles } from '../enums/userRoles';

export function requireRoles(roles: userRoles[]) {
  return async (req: RequestWithUserId, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user!.role))
      return res
        .status(401)
        .json({ errors: ["you don't have permission to do this action"] });
    next();
  };
}
