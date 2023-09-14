import { Types } from 'mongoose'

// Validates that an id string is a valid mongo id
export function isValidMongoId(id: string): boolean {
  return Types.ObjectId.isValid(id)
}
