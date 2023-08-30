import { Model } from 'mongoose';
import { IUser, UserDto } from '../models/User';
import { hash } from 'bcrypt';

export class UserService {
  constructor(public readonly userModel: Model<IUser>) {
    this.userModel = userModel;
  }

  async findUserByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async createUser(createUserDto: UserDto) {
    createUserDto.password = await hash(createUserDto.password, 10); // TODO: Extract this hashing into helper function
    const user = await this.userModel.create({ ...createUserDto });
    return await user.save();
  }
}
