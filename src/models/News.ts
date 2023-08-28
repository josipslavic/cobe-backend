import {
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import mongoose, { Document, Schema } from 'mongoose';
import { newsCategories } from '../constants/newsCategories';
import { Type } from 'class-transformer';
import 'reflect-metadata';

export interface INews extends Document {
  createdBy: string;
  lastEditedBy: string;
  headline: string;
  shortDescription: string;
  fullDescription: string;
  imageUrl: string;
  category: string;
  createdAt: Date;
  lastEditedAt: Date;
  isBreakingNews: boolean;
  views: number;
}

export class NewsDto {
  @IsString()
  @MinLength(1)
  headline: string;

  @IsString()
  @MinLength(1)
  shortDescription: string;

  @IsString()
  @MinLength(1)
  fullDescription: string;

  @IsIn(newsCategories)
  category: string;

  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  isBreakingNews: boolean;
}

const NewsSchema = new Schema<INews>(
  {
    createdBy: {
      type: String,
      required: true,
    },
    lastEditedBy: {
      type: String,
      required: true,
    },
    headline: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    fullDescription: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: newsCategories,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastEditedAt: {
      type: Date,
      default: Date.now,
    },
    isBreakingNews: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: false,
  }
);

export const NewsModel = mongoose.model<INews>('News', NewsSchema);
