import { Router } from 'express';
import { validateBody } from '../middleware/validateBody';
import { CommentDto, CommentModel } from '../models/Comment';
import { RequestWithUserId, isAuth } from '../middleware/isAuth';
import { CommentService } from '../services/comment.service';
import { requireRoles } from '../middleware/requireRoles';

export const commentRouter = Router();

commentRouter.get('/:commentId', async (req, res) => {
  const commentService = new CommentService(CommentModel);
  const comment = await commentService.getCommentById(req.params.commentId);

  if (!comment) return res.status(404).json({ errors: ['comment not found'] });

  return res.status(200).json(comment);
});

commentRouter.post(
  '/:newsId',
  validateBody(CommentDto),
  isAuth,
  async (req: RequestWithUserId, res) => {
    const commentService = new CommentService(CommentModel);
    const comment = await commentService.createComment(
      req.body,
      req.user!.fullName || req.user!.alias, // alias required in case user is a guest
      req.params.newsId as string
    );
    return res.status(200).json(comment);
  }
);

commentRouter.delete(
  '/:commentId',
  isAuth,
  requireRoles(['admin']),
  async (req: RequestWithUserId, res) => {
    const commentService = new CommentService(CommentModel);
    await commentService.deleteComment(req.params.commentId);
    return res.status(200).json({ message: 'Comment deleted successfully' });
  }
);
