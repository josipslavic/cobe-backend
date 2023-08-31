import { Request } from 'express';
import { userRoles } from '../enums/userRoles';

export interface RequestWithUserId extends Request {
  user?: {
    id: string;
    role: userRoles;
    alias: string;
    fullName?: string;
  };
}
