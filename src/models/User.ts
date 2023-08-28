import {
  IsEmail,
  IsIn,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';
import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  role: 'admin' | 'editor' | 'guest';
  fullName?: string;
  alias: string;
  registeredAt: Date;
}

export class UserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(1)
  password: string;

  @IsIn(['admin', 'editor', 'guest'])
  role: 'admin' | 'editor' | 'guest';

  @ValidateIf((o) => o.role !== 'guest')
  @IsString()
  @MinLength(1)
  fullName?: string;

  @IsString()
  @MinLength(1)
  alias: string;
}

const UserSchema = new Schema<IUser>(
  {
    role: {
      type: String,
      enum: ['admin', 'editor', 'guest'],
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
);

export const UserModel = mongoose.model<IUser>('User', UserSchema);
