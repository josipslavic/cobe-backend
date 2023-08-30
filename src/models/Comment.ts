import { IsString, MinLength } from 'class-validator';
import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document { // TODO: extract interface
  comment: string;
  commenter: string;
  news: mongoose.ObjectIdSchemaDefinition;
  createdAt: Date;
}

export class CommentDto {
  @IsString()
  @MinLength(1)
  comment: string;
}

const CommentSchema = new Schema<IComment>(
  {
    comment: {
      type: String,
      required: true,
    },
    commenter: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    news: {
      type: mongoose.Types.ObjectId,
      ref: 'News',
      required: true,
    },
  },
  {
    timestamps: false,
  }
);

export const CommentModel = mongoose.model<IComment>('Comments', CommentSchema);
