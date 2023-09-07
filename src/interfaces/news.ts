import { Document } from 'mongoose';

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
