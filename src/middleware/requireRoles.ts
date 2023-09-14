import { NextFunction, Response } from 'express'

import { commonErrors } from '../constants/commonErrors'
import { UserRoles } from '../enums/UserRoles'
import { RequestWithUserId } from '../interfaces/requestWithUserId'

export function requireRoles(roles: UserRoles[]) {
  return async (req: RequestWithUserId, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user!.role)) next(commonErrors.permissionDenied)
    next()
  }
}
