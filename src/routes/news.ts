import { Router } from 'express'

import { NewsController } from '../controllers/news.controller'
import { UserRoles } from '../enums/UserRoles'
import { isAuth } from '../middleware/isAuth'
import { requireRoles } from '../middleware/requireRoles'
import { validateBody } from '../middleware/validateBody'
import { NewsDto, NewsModel } from '../models/News'
import { NewsService } from '../services/news.service'
import { upload } from '../utils/multerUpload'

export const newsRouter = Router()

const newsService = new NewsService(NewsModel)
const newsController = new NewsController(newsService)

newsRouter.get('/front-page', newsController.getFrontPage)

newsRouter.get('/:newsId', newsController.getNewsById)

newsRouter.post(
  '/',
  upload.single('image'),
  validateBody(NewsDto),
  isAuth,
  requireRoles([UserRoles.ADMIN, UserRoles.EDITOR]),
  newsController.createNews
)

newsRouter.patch(
  '/:newsId',
  upload.single('image'),
  validateBody(NewsDto, true),
  isAuth,
  requireRoles([UserRoles.ADMIN, UserRoles.EDITOR]),
  newsController.updateNews
)

newsRouter.delete(
  '/:newsId',
  isAuth,
  requireRoles([UserRoles.ADMIN]),
  newsController.deleteNews
)

newsRouter.post('/populate/:query', newsController.populateData)
