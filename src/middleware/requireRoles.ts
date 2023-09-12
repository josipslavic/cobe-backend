import { Response, NextFunction } from 'express';
import { RequestWithUserId } from '../interfaces/requestWithUserId';
import { UserRoles } from '../enums/UserRoles';
import { commonErrors } from '../constants/commonErrors';

export function requireRoles(roles: UserRoles[]) {
  return async (req: RequestWithUserId, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user!.role)) next(commonErrors.permissionDenied);
    next();
  };
}
