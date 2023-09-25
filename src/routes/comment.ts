import { Router } from 'express'

import { inject, injectable } from 'inversify'
import { CommentController } from '../controllers/comment.controller'
import { UserRoles } from '../enums/UserRoles'
import { isAuth } from '../middleware/isAuth'
import { requireRoles } from '../middleware/requireRoles'
import { validateBody } from '../middleware/validateBody'
import { CommentDto } from '../models/Comment'
import { TYPES } from '../types/types'
import { IRoute } from '../interfaces/route'

@injectable()
export class CommentRoutes implements IRoute {
  private readonly commentController: CommentController
  private readonly router: Router

  constructor(
    @inject(TYPES.CommentController)
    commentController: CommentController
  ) {
    this.commentController = commentController
    this.router = Router()
    this.initRouter()
  }

  getRouter(): Router {
    return this.router
  }

  getPath(): string {
    return '/comment'
  }

  private initRouter() {
    this.router.get('/:commentId', this.commentController.getCommentById)

    this.router.post(
      '/:newsId',
      validateBody(CommentDto),
      isAuth,
      this.commentController.addComment
    )

    this.router.delete(
      '/:commentId',
      isAuth,
      requireRoles([UserRoles.ADMIN]),
      this.commentController.deleteComment
    )
  }
}
