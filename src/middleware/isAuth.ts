import 'dotenv/config'
import { NextFunction, Response } from 'express'
import jwt, { JsonWebTokenError } from 'jsonwebtoken'

import { commonErrors } from '../constants/commonErrors'
import { IJwt } from '../interfaces/jwt'
import { RequestWithUserId } from '../interfaces/requestWithUserId'

export const isAuth = (
  req: RequestWithUserId,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization || ''
    const decoded = jwt.verify(token, process.env.JWT_KEY as string) as IJwt
    req.user = {
      id: decoded.id,
      role: decoded.role,
      alias: decoded.alias,
      fullName: decoded.fullName,
    }
    next()
  } catch (error) {
    if (error instanceof JsonWebTokenError) error = commonErrors.authFailed
    next(error)
  }
}
