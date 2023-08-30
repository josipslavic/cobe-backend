import { Router } from 'express';
import { validateBody } from '../middleware/validateBody';
import { UserDto } from '../models/User';
import { userController } from '../controllers/user.controller';

export const userRouter = Router();

userRouter.post('/register', validateBody(UserDto), userController.register);

userRouter.post('/login', userController.login);
