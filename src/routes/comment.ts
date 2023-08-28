import { Router } from 'express';
import { validateBody } from '../middleware/validateBody';
import { CommentDto, CommentModel } from '../models/Comment';
import { RequestWithUserId, isAuth } from '../middleware/isAuth';
import { CommentService } from '../services/comment.service';
import { requireRoles } from '../middleware/requireRoles';
import { NewsService } from '../services/news.service';
import { NewsModel } from '../models/News';
import { CastError } from 'mongoose';
import { isValidMongoId } from '../utils/isValidMongoId';

export const commentRouter = Router();

commentRouter.get('/:commentId', async (req, res) => {
  const commentService = new CommentService(CommentModel);

  if (!isValidMongoId(req.params.commentId))
    return res
      .status(400)
      .json({ errors: ['please enter a valid a mongo id'] });

  const comment = await commentService.getCommentById(req.params.commentId);
  if (!comment) return res.status(404).json({ errors: ['comment not found'] });

  return res.status(200).json(comment);
});

commentRouter.post(
  '/:newsId',
  validateBody(CommentDto),
  isAuth,
  async (req: RequestWithUserId, res) => {
    const newsService = new NewsService(NewsModel);
    const commentService = new CommentService(CommentModel);

    if (!isValidMongoId(req.params.newsId))
      return res
        .status(400)
        .json({ errors: ['please enter a valid a mongo id'] });

    const existingNews = newsService.getNewsById(req.params.newsId);
    if (!existingNews)
      return res.status(404).json({ errors: ['news not found'] });

    const comment = await commentService.createComment(
      req.body,
      req.user!.fullName || req.user!.alias, // alias required in case user is a guest
      req.params.newsId as string
    );
    return res.status(201).json(comment);
  }
);

commentRouter.delete(
  '/:commentId',
  isAuth,
  requireRoles(['admin']),
  async (req: RequestWithUserId, res) => {
    const commentService = new CommentService(CommentModel);

    if (!isValidMongoId(req.params.commentId))
      return res
        .status(400)
        .json({ errors: ['please enter a valid a mongo id'] });

    const existingComment = commentService.getCommentById(req.params.commentId);
    if (!existingComment)
      return res.status(404).json({ errors: ['comment not found'] });

    await commentService.deleteComment(req.params.commentId);
    return res.status(200).json({ message: 'Comment deleted successfully' });
  }
);
