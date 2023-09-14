import mongoose, { Document } from 'mongoose'

export interface IComment extends Document {
  comment: string
  commenter: mongoose.ObjectIdSchemaDefinition
  news: mongoose.ObjectIdSchemaDefinition
  createdAt: Date
}
