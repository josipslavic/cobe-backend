import { IUser } from '../interfaces/user';
import jwt from 'jsonwebtoken';

export function signJWT(user: IUser) {
  return jwt.sign(
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
}
