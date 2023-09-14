import { IsEmail, IsIn, IsString, MinLength, ValidateIf } from 'class-validator'
import mongoose, { Schema } from 'mongoose'

import { UserRoles } from '../enums/UserRoles'
import { IUser } from '../interfaces/user'

export class UserDto {
  @IsEmail()
  email: string

  @IsString()
  @MinLength(1)
  password: string

  @IsIn(Object.values(UserRoles))
  role: UserRoles

  @ValidateIf((o) => o.role !== 'guest')
  @IsString()
  @MinLength(1)
  fullName?: string

  @IsString()
  @MinLength(1)
  alias: string
}

const UserSchema = new Schema<IUser>(
  {
    role: {
      type: String,
      enum: UserRoles,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
    },
    alias: {
      type: String,
      required: true,
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
)

export const UserModel = mongoose.model<IUser>('User', UserSchema)
