import { NextFunction, Request, Response } from 'express'

import { commonErrors } from '../constants/commonErrors'
import { successResponses } from '../constants/successRespones'
import { UserService } from '../services/user.service'
import { comparePassword } from '../utils/comparePassword'
import { signJWT } from '../utils/signJWT'

export class UserController {
  constructor(private userService: UserService) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const existingUser = await this.userService.findUserByEmail(
        req.body.email
      )
      if (existingUser) throw commonErrors.emailTaken

      const user = await this.userService.createUser(req.body)

      const token = signJWT(user)

      return successResponses.created(res, { user, token })
    } catch (error) {
      next(error)
    }
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body.email || !req.body.password) throw commonErrors.authFailed

      const existingUser = await this.userService.findUserByEmail(
        req.body.email
      )
      if (!existingUser) throw commonErrors.invalidCredentials

      const isPasswordMatching = await comparePassword(
        req.body.password,
        existingUser.password
      )

      if (!isPasswordMatching) throw commonErrors.invalidCredentials

      const token = signJWT(existingUser)

      return successResponses.ok(res, { user: existingUser, token })
    } catch (error) {
      next(error)
    }
  }
}
