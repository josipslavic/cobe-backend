import { Router } from 'express'

import { container } from '../config/inversify'
import { CommentController } from '../controllers/comment.controller'
import { UserRoles } from '../enums/UserRoles'
import { isAuth } from '../middleware/isAuth'
import { requireRoles } from '../middleware/requireRoles'
import { validateBody } from '../middleware/validateBody'
import { CommentDto } from '../models/Comment'
import { TYPES } from '../types/types'

export const commentRouter = Router()

const commentController = container.get<CommentController>(
  TYPES.CommentController
)

commentRouter.get('/:commentId', commentController.getCommentById)

commentRouter.post(
  '/:newsId',
  validateBody(CommentDto),
  isAuth,
  commentController.addComment
)

commentRouter.delete(
  '/:commentId',
  isAuth,
  requireRoles([UserRoles.ADMIN]),
  commentController.deleteComment
)
