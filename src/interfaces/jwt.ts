import { UserRoles } from '../enums/UserRoles'

export interface IJwt {
  id: string
  role: UserRoles
  alias: string
  fullName?: string
}
