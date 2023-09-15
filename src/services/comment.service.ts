import { Model } from 'mongoose'
import { inject, injectable } from 'inversify'

import { IComment } from '../interfaces/comment'
import { CommentDto } from '../models/Comment'
import { TYPES } from '../types/types'

@injectable()
export class CommentService {
  constructor(
    @inject(TYPES.CommentModel) public readonly commentModel: Model<IComment>
  ) {
    this.commentModel = commentModel
  }

  async getCommentById(id: string) {
    return await this.commentModel
      .findOne({ _id: id })
      .populate(['commenter', 'news'])
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
    })
    return await comment.save()
  }

  async deleteComment(commentId: string) {
    return await this.commentModel.findOneAndRemove({ _id: commentId }).exec()
  }
}
