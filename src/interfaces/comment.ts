import mongoose, { Document } from 'mongoose';

export interface IComment extends Document {
  comment: string;
  commenter: string;
  news: mongoose.ObjectIdSchemaDefinition;
  createdAt: Date;
}
