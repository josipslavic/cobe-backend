import { Router } from 'express';
import { NewsService } from '../services/news.service';
import { NewsController } from '../controllers/news.controller';
import { validateBody } from '../middleware/validateBody';
import { NewsDto, NewsModel } from '../models/News';
import { isAuth } from '../middleware/isAuth';
import { upload } from '../utils/multerUpload';
import { requireRoles } from '../middleware/requireRoles';
import { UserRoles } from '../enums/UserRoles';

export const newsRouter = Router();

const newsService = new NewsService(NewsModel);
const newsController = new NewsController(newsService);

newsRouter.get('/front-page', newsController.getFrontPage);

newsRouter.get('/:newsId', newsController.getNewsById);

newsRouter.post(
  '/',
  upload.single('image'),
  validateBody(NewsDto),
  isAuth,
  requireRoles([UserRoles.ADMIN, UserRoles.EDITOR]),
  newsController.createNews
);

newsRouter.patch(
  '/:newsId',
  upload.single('image'),
  validateBody(NewsDto, true),
  isAuth,
  requireRoles([UserRoles.ADMIN, UserRoles.EDITOR]),
  newsController.updateNews
);

newsRouter.delete(
  '/:newsId',
  isAuth,
  requireRoles([UserRoles.ADMIN]),
  newsController.deleteNews
);

newsRouter.post('/populate/:query', newsController.populateData);
