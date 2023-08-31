import { userRoles } from '../enums/userRoles';

export interface IJwt {
  id: string;
  role: userRoles;
  alias: string;
  fullName?: string;
}
