import { Request } from 'express';
import { UserRoles } from '../enums/UserRoles';

export interface RequestWithUserId extends Request {
  user?: {
    id: string;
    role: UserRoles;
    alias: string;
    fullName?: string;
  };
}
