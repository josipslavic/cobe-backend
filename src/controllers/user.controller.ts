import { Request, Response } from 'express';
import { UserService, userService } from '../services/user.service';
import { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';

class UserController {
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
        expiresIn: '3000h', // large number for testing  // TODO: Set it in some config variable
      }
    );

    return res.status(201).json({ user, token });
  };

  login = async (req: Request, res: Response) => {
    if (!req.body.email || !req.body.password)
      return res
        .status(400)
        .json({ errors: ['please provide a username and password'] });

    const existingUser = await this.userService.findUserByEmail(req.body.email);
    if (!existingUser)
      return res
        .status(404)
        .json({ errors: ["user with that email doesn't exist"] });

    const isPasswordMatching = await compare(
      req.body.password,
      existingUser.password
    );

    if (!isPasswordMatching) {
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
  };
}

export const userController = new UserController(userService);
