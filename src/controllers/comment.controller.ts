import { CommentService } from '../services/comment.service';
import { NextFunction, Request, Response } from 'express';
import { isValidMongoId } from '../utils/isValidMongoId';
import { NewsService } from '../services/news.service';
import { RequestWithUserId } from '../interfaces/requestWithUserId';
import { commonErrors } from '../constants/commonErrors';
import { statusCodes } from '../constants/statusCodes';
import { successResponses } from '../constants/successRespones';

export class CommentController {
  constructor(
    private commentService: CommentService,
    private newsService: NewsService
  ) {}

  getCommentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!isValidMongoId(req.params.commentId))
        throw commonErrors.invalidMongoId;

      const comment = await this.commentService.getCommentById(
        req.params.commentId
      );
      if (!comment) throw commonErrors.commentNotFound;

      return res.status(statusCodes.ok).json(comment);
    } catch (error) {
      next(error);
    }
  };

  addComment = async (
    req: RequestWithUserId,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!isValidMongoId(req.params.newsId)) throw commonErrors.invalidMongoId;

      const existingNews = this.newsService.getNewsById(req.params.newsId);
      if (!existingNews) throw commonErrors.newsNotFound;

      const comment = await this.commentService.createComment(
        req.body,
        req.user!.id,
        req.params.newsId as string
      );

      return res.status(statusCodes.created).json(comment);
    } catch (error) {
      next(error);
    }
  };

  deleteComment = async (
    req: RequestWithUserId,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!isValidMongoId(req.params.commentId))
        throw commonErrors.invalidMongoId;

      const existingComment = this.commentService.getCommentById(
        req.params.commentId
      );
      if (!existingComment) throw commonErrors.commentNotFound;

      await this.commentService.deleteComment(req.params.commentId);

      return successResponses.deleteSuccess(res);
    } catch (error) {
      next(error);
    }
  };
}
