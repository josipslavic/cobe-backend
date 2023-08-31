import { Model } from 'mongoose';
import { CommentDto } from '../models/Comment';
import { IComment } from '../interfaces/comment';

export class CommentService {
  constructor(public readonly commentModel: Model<IComment>) {
    this.commentModel = commentModel;
  }

  async getCommentById(id: string) {
    return await this.commentModel.findOne({ _id: id }).populate('news');
  }

  async createComment(
    createCommentDto: CommentDto,
    commenter: string,
    newsId: string
  ) {
    const comment = await this.commentModel.create({
      ...createCommentDto,
      commenter,
      news: newsId,
    });
    return await comment.save();
  }

  async deleteComment(commentId: string) {
    return await this.commentModel.findOneAndRemove({ _id: commentId }).exec();
  }
}
