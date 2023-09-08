import {
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import mongoose, { Schema } from 'mongoose';
import { newsCategories } from '../constants/newsCategories';
import { Type } from 'class-transformer';
import 'reflect-metadata';
import { INews } from '../interfaces/news';

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
    imageId: {
      type: String,
      required: true,
      default: null,
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
