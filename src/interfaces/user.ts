import { Document } from 'mongoose';
import { userRoles } from '../enums/userRoles';

export interface IUser extends Document {
  email: string;
  password: string;
  role: userRoles;
  fullName?: string;
  alias: string;
  registeredAt: Date;
}
