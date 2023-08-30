import { CommentService } from '../services/comment.service';
import { Request, Response } from 'express';
import { isValidMongoId } from '../utils/isValidMongoId';
import { RequestWithUserId } from '../middleware/isAuth';
import { NewsService } from '../services/news.service';
import {
  COMMENT_NOT_FOUND,
  INVALID_MONGO_ID,
  NEWS_NOT_FOUND,
} from '../constants/messages';

export class CommentController {
  constructor(
    private commentService: CommentService,
    private newsService: NewsService
  ) {}

  getCommentById = async (req: Request, res: Response) => {
    if (!isValidMongoId(req.params.commentId))
      return res.status(400).json({ errors: [INVALID_MONGO_ID] }); // TODO: Remove all semicolons 

    const comment = await this.commentService.getCommentById(
      req.params.commentId
    );
    if (!comment) return res.status(404).json({ errors: [COMMENT_NOT_FOUND] });

    return res.status(200).json(comment);
  };

  addComment = async (req: RequestWithUserId, res: Response) => {
    if (!isValidMongoId(req.params.newsId))
      return res.status(400).json({ errors: [INVALID_MONGO_ID] });

    const existingNews = this.newsService.getNewsById(req.params.newsId);
    if (!existingNews)
      return res.status(404).json({ errors: [NEWS_NOT_FOUND] });

    const comment = await this.commentService.createComment(
      req.body,
      req.user!.fullName || req.user!.alias, // alias required in case user is a guest
      req.params.newsId as string
    );

    return res.status(201).json(comment);
  };

  deleteComment = async (req: RequestWithUserId, res: Response) => {
    if (!isValidMongoId(req.params.commentId))
      return res.status(400).json({ errors: [INVALID_MONGO_ID] });

    const existingComment = this.commentService.getCommentById(
      req.params.commentId
    );
    if (!existingComment)
      return res.status(404).json({ errors: [COMMENT_NOT_FOUND] });

    await this.commentService.deleteComment(req.params.commentId);

    return res.status(200).json({ message: 'Comment deleted successfully' });
  };
}
