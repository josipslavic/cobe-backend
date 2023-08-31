import { Model } from 'mongoose';
import { IUser, UserDto } from '../models/User';
import { hashPassword } from '../utils/hashPassword';

export class UserService {
  constructor(public readonly userModel: Model<IUser>) {
    this.userModel = userModel;
  }

  async findUserByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async createUser(createUserDto: UserDto) {
    createUserDto.password = await hashPassword(createUserDto.password);
    const user = await this.userModel.create({ ...createUserDto });
    return await user.save();
  }
}
