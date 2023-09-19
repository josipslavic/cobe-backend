import { Router } from 'express'

import { inject, injectable } from 'inversify'
import { NewsController } from '../controllers/news.controller'
import { UserRoles } from '../enums/UserRoles'
import { isAuth } from '../middleware/isAuth'
import { requireRoles } from '../middleware/requireRoles'
import { validateBody } from '../middleware/validateBody'
import { NewsDto } from '../models/News'
import { TYPES } from '../types/types'
import { upload } from '../utils/multerUpload'

@injectable()
export class NewsRoutes {
  private readonly newsController: NewsController
  private readonly router: Router

  constructor(
    @inject(TYPES.NewsController)
    newsController: NewsController
  ) {
    this.newsController = newsController
    this.router = Router()
    this.initRouter()
  }

  getRouter(): Router {
    return this.router
  }

  getPath(): string {
    return '/news'
  }

  private initRouter() {
    this.router.get('/front-page', this.newsController.getFrontPage)

    this.router.get('/:newsId', this.newsController.getNewsById)

    this.router.post(
      '/',
      upload.single('image'),
      validateBody(NewsDto),
      isAuth,
      requireRoles([UserRoles.ADMIN, UserRoles.EDITOR]),
      this.newsController.createNews
    )

    this.router.patch(
      '/:newsId',
      upload.single('image'),
      validateBody(NewsDto, true),
      isAuth,
      requireRoles([UserRoles.ADMIN, UserRoles.EDITOR]),
      this.newsController.updateNews
    )

    this.router.delete(
      '/:newsId',
      isAuth,
      requireRoles([UserRoles.ADMIN]),
      this.newsController.deleteNews
    )

    this.router.post('/populate/:query', this.newsController.populateData)
  }
}
