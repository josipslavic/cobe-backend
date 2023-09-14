import { Router } from 'express'

import { UserController } from '../controllers/user.controller'
import { validateBody } from '../middleware/validateBody'
import { UserDto, UserModel } from '../models/User'
import { UserService } from '../services/user.service'

export const userRouter = Router()

const userController = new UserController(new UserService(UserModel))

userRouter.post('/register', validateBody(UserDto), userController.register)

userRouter.post('/login', userController.login)
