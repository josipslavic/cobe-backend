import { Router } from 'express';
import { validateBody } from '../middleware/validateBody';
import { CommentDto, CommentModel } from '../models/Comment';
import { isAuth } from '../middleware/isAuth';
import { CommentService } from '../services/comment.service';
import { requireRoles } from '../middleware/requireRoles';
import { NewsService } from '../services/news.service';
import { NewsModel } from '../models/News';
import { CommentController } from '../controllers/comment.controller';
import { UserRoles } from '../enums/UserRoles';

export const commentRouter = Router();

const commentService = new CommentService(CommentModel);
const newsService = new NewsService(NewsModel);
const commentController = new CommentController(commentService, newsService);

commentRouter.get('/:commentId', commentController.getCommentById);

commentRouter.post(
  '/:newsId',
  validateBody(CommentDto),
  isAuth,
  commentController.addComment
);

commentRouter.delete(
  '/:commentId',
  isAuth,
  requireRoles([UserRoles.ADMIN]),
  commentController.deleteComment
);
