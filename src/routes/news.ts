import { Router } from 'express';
import { NewsService } from '../services/news.service';
import { NewsController } from '../controllers/news.controller';
import { validateBody } from '../middleware/validateBody';
import { NewsDto, NewsModel } from '../models/News';
import { isAuth } from '../middleware/isAuth';
import { upload } from '../utils/multerUpload';
import { requireRoles } from '../middleware/requireRoles';
import { userRoles } from '../enums/userRoles';

export const newsRouter = Router();

const newsService = new NewsService(NewsModel);
const newsController = new NewsController(newsService);

newsRouter.get('/:newsId', newsController.getNewsById);

newsRouter.post(
  '/',
  upload.single('image'),
  validateBody(NewsDto),
  isAuth,
  requireRoles([userRoles.ADMIN, userRoles.EDITOR]),
  newsController.createNews
);

newsRouter.patch(
  '/:newsId',
  upload.single('image'),
  validateBody(NewsDto, true),
  isAuth,
  requireRoles([userRoles.ADMIN, userRoles.EDITOR]),
  newsController.updateNews
);

newsRouter.delete(
  '/:newsId',
  isAuth,
  requireRoles([userRoles.ADMIN]),
  newsController.deleteNews
);

newsRouter.get('/front-page', newsController.getFrontPage);

newsRouter.post('/populate/:query', newsController.populateData);
