import { Router } from 'express'

import { container } from '../config/inversify'
import { UserController } from '../controllers/user.controller'
import { validateBody } from '../middleware/validateBody'
import { UserDto } from '../models/User'
import { TYPES } from '../types/types'

export const userRouter = Router()

const userController = container.get<UserController>(TYPES.UserController)

userRouter.post('/register', validateBody(UserDto), userController.register)

userRouter.post('/login', userController.login)
