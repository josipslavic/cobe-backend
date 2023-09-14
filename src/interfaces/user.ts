import { Document } from 'mongoose'

import { UserRoles } from '../enums/UserRoles'

export interface IUser extends Document {
  email: string
  password: string
  role: UserRoles
  fullName?: string
  alias: string
  registeredAt: Date
}
