import { Router } from 'express';
import { validateBody } from '../middleware/validateBody';
import { CommentDto } from '../models/Comment';
import { isAuth } from '../middleware/isAuth';
import { requireRoles } from '../middleware/requireRoles';
import { commentController } from '../controllers/comment.controller';

export const commentRouter = Router();

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
  requireRoles(['admin']),
  commentController.deleteComment
);
