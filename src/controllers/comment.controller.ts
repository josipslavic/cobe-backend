import { NextFunction, Request, Response } from 'express'
import { inject, injectable } from 'inversify'

import { commonErrors } from '../constants/commonErrors'
import * as MESSAGES from '../constants/messages'
import { successResponses } from '../constants/successRespones'
import { RequestWithUserId } from '../interfaces/requestWithUserId'
import { CommentService } from '../services/comment.service'
import { NewsService } from '../services/news.service'
import { TYPES } from '../types/types'
import { isValidMongoId } from '../utils/isValidMongoId'

@injectable()
export class CommentController {
  constructor(
    @inject(TYPES.CommentService) private commentService: CommentService,
    @inject(TYPES.NewsService) private newsService: NewsService
  ) {}

  getCommentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!isValidMongoId(req.params.commentId))
        throw commonErrors.invalidMongoId

      const comment = await this.commentService.getCommentById(
        req.params.commentId
      )
      if (!comment) throw commonErrors.commentNotFound

      return successResponses.ok(res, comment)
    } catch (error) {
      next(error)
    }
  }

  addComment = async (
    req: RequestWithUserId,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!isValidMongoId(req.params.newsId)) throw commonErrors.invalidMongoId

      const existingNews = this.newsService.getNewsById(req.params.newsId)
      if (!existingNews) throw commonErrors.newsNotFound

      const comment = await this.commentService.createComment(
        req.body,
        req.user!.id,
        req.params.newsId as string
      )

      return successResponses.created(res, comment)
    } catch (error) {
      next(error)
    }
  }

  deleteComment = async (
    req: RequestWithUserId,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!isValidMongoId(req.params.commentId))
        throw commonErrors.invalidMongoId

      const existingComment = await this.commentService.getCommentById(
        req.params.commentId
      )
      if (!existingComment) throw commonErrors.commentNotFound

      await this.commentService.deleteComment(req.params.commentId)

      return successResponses.ok(res, MESSAGES.DELETE_SUCCESS)
    } catch (error) {
      next(error)
    }
  }
}
