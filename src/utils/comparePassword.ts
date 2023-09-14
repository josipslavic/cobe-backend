import { compare } from 'bcrypt'

export async function comparePassword(password: string, userPassword: string) {
  return await compare(password, userPassword)
}
