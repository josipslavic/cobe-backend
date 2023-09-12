import { NextFunction, Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { commonErrors } from '../constants/commonErrors';
import { statusCodes } from '../constants/statusCodes';

export class UserController {
  constructor(private userService: UserService) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const existingUser = await this.userService.findUserByEmail(
        req.body.email
      );
      if (existingUser) throw commonErrors.emailTaken;

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
          expiresIn: process.env.JWT_EXPIRES_IN,
        }
      );

      return res.status(statusCodes.created).json({ user, token });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body.email || !req.body.password) throw commonErrors.authFailed;

      const existingUser = await this.userService.findUserByEmail(
        req.body.email
      );
      if (!existingUser) throw commonErrors.invalidCredentials;

      const isPasswordMatching = await compare(
        req.body.password,
        existingUser.password
      );

      if (!isPasswordMatching) throw commonErrors.invalidCredentials;

      const token = jwt.sign(
        {
          id: existingUser.id,
          role: existingUser.role,
          fullName: existingUser.fullName,
          alias: existingUser.alias,
        },
        process.env.JWT_KEY as string,
        {
          expiresIn: process.env.JWT_EXPIRES_IN,
        }
      );

      return res.status(statusCodes.ok).json({ user: existingUser, token });
    } catch (error) {
      next(error);
    }
  };
}
