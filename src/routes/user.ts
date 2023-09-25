import { Router } from 'express'

import { inject, injectable } from 'inversify'
import { UserController } from '../controllers/user.controller'
import { validateBody } from '../middleware/validateBody'
import { UserDto } from '../models/User'
import { TYPES } from '../types/types'
import { IRoute } from '../interfaces/route'

@injectable()
export class UserRoutes implements IRoute {
  private readonly userController: UserController
  private readonly router: Router

  constructor(
    @inject(TYPES.UserController)
    userController: UserController
  ) {
    this.userController = userController
    this.router = Router()
    this.initRouter()
  }

  getRouter(): Router {
    return this.router
  }

  getPath(): string {
    return '/auth'
  }

  private initRouter() {
    this.router.post(
      '/register',
      validateBody(UserDto),
      this.userController.register
    )

    this.router.post('/login', this.userController.login)
  }
}
