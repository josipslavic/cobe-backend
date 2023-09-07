import { Model } from 'mongoose';
import { CommentDto } from '../models/Comment';
import { IComment } from '../interfaces/comment';
import { CommentRelations } from '../enums/relations';

export class CommentService {
  constructor(public readonly commentModel: Model<IComment>) {
    this.commentModel = commentModel;
  }

  async getCommentById(id: string) {
    return await this.commentModel
      .findOne({ _id: id })
      .populate([CommentRelations.commenter, CommentRelations.news]);
  }

  async createComment(
    createCommentDto: CommentDto,
    commetnerId: string,
    newsId: string
  ) {
    const comment = await this.commentModel.create({
      ...createCommentDto,
      commenter: commetnerId,
      news: newsId,
    });
    return await comment.save();
  }

  async deleteComment(commentId: string) {
    return await this.commentModel.findOneAndRemove({ _id: commentId }).exec();
  }
}
