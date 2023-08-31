import { hash } from 'bcrypt';
import { HASH_SALTS } from '../constants/numbers';

export async function hashPassword(password: string) {
  return await hash(password, HASH_SALTS);
}
