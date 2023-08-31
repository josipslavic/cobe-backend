import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  AUTH_FAILED,
  INVALID_PASSWORD,
  USER_EMAIL_NOT_FOUND,
} from '../constants/error-messages';

export class UserController {
  constructor(private userService: UserService) {}

  register = async (req: Request, res: Response) => {
    const existingUser = await this.userService.findUserByEmail(req.body.email);
    if (existingUser)
      return res.status(409).json({ errors: ['email is already taken'] });

    const user = await this.userService.createUser(req.body);

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        fullName: user.fullName,
        alias: user.alias,
      },
      process.env.JWT_KEY as string,
      {
        expiresIn: process.env.JWT_EXPIRES_IN, // large number for testing
      }
    );

    return res.status(201).json({ user, token });
  };

  login = async (req: Request, res: Response) => {
    if (!req.body.email || !req.body.password)
      return res.status(400).json({ errors: [AUTH_FAILED] });

    const existingUser = await this.userService.findUserByEmail(req.body.email);
    if (!existingUser)
      return res.status(404).json({ errors: [USER_EMAIL_NOT_FOUND] });

    const isPasswordMatching = await compare(
      req.body.password,
      existingUser.password
    );

    if (!isPasswordMatching) {
      return res.status(401).json({ errors: [INVALID_PASSWORD] });
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
        expiresIn: process.env.JWT_EXPIRES_IN, // large number for testing
      }
    );

    return res.status(200).json({ user: existingUser, token });
  };
}
