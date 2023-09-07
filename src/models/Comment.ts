import { IsString, MinLength } from 'class-validator';
import mongoose, { Schema } from 'mongoose';
import { IComment } from '../interfaces/comment';

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
      type: mongoose.Types.ObjectId,
      ref: 'User',
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
