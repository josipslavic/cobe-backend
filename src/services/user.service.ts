import { Model } from 'mongoose'
import { inject, injectable } from 'inversify'

import { IUser } from '../interfaces/user'
import { UserDto } from '../models/User'
import { TYPES } from '../types/types'
import { hashPassword } from '../utils/hashPassword'

@injectable()
export class UserService {
  constructor(
    @inject(TYPES.UserModel) public readonly userModel: Model<IUser>
  ) {
    this.userModel = userModel
  }

  async findUserByEmail(email: string) {
    return await this.userModel.findOne({ email })
  }

  async createUser(createUserDto: UserDto) {
    createUserDto.password = await hashPassword(createUserDto.password)
    const user = await this.userModel.create({ ...createUserDto })
    return await user.save()
  }
}
