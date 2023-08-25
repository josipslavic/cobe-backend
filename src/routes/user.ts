import { Router } from 'express';
import { validateBody } from '../middleware/validateBody';
import { UserDto, UserModel } from '../models/User';
import { UserService } from '../services/user.service';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { compare } from 'bcrypt';
import 'dotenv/config';

mongoose.connect(process.env.MONGO_URI as string);

export const userRouter = Router();

userRouter.post('/register', validateBody(UserDto), async (req, res) => {
  const userService = new UserService(UserModel);

  const existingUser = await userService.findUserByEmail(req.body.email);
  if (existingUser)
    return res.status(409).json({ errors: ['email is already taken'] });

  const user = await userService.createUser(req.body);

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
      fullName: user.fullName,
      alias: user.alias,
    },
    process.env.JWT_KEY as string,
    {
      expiresIn: '3000h', // large number for testing
    }
  );
  return res.status(200).json({ user, token });
});

userRouter.post('/login', async (req, res) => {
  const userService = new UserService(UserModel);

  const existingUser = await userService.findUserByEmail(req.body.email);
  if (!existingUser)
    return res
      .status(404)
      .json({ errors: ["user with that email doesn't exist"] });

  try {
    await compare(req.body.password, existingUser.password);
  } catch (error) {
    return res.status(401).json({ errors: ['invalid password'] });
  }

  const token = jwt.sign(
    {
      id: existingUser.id,
      role: existingUser.role,
      fullName: existingUser.fullName,
      alias: existingUser.alias,
    },
    process.env.JWT_KEY as string,
    {
      expiresIn: '3000h', // large number for testing
    }
  );
  return res.status(200).json({ user: existingUser, token });
});
