import { Router } from 'express';
import { newsController } from '../controllers/news.controller';
import { validateBody } from '../middleware/validateBody';
import { NewsDto } from '../models/News';
import { isAuth } from '../middleware/isAuth';
import { upload } from '../utils/multerUpload';
import { requireRoles } from '../middleware/requireRoles';

export const newsRouter = Router();

newsRouter.get('/:newsId', newsController.getNewsById);

newsRouter.post(
  '/',
  upload.single('image'),
  validateBody(NewsDto),
  isAuth,
  requireRoles(['admin', 'editor']),
  newsController.createNews
);

newsRouter.patch(
  '/:newsId',
  upload.single('image'),
  validateBody(NewsDto, true),
  isAuth,
  requireRoles(['admin', 'editor']),
  newsController.updateNews
);

newsRouter.delete(
  '/:newsId',
  isAuth,
  requireRoles(['admin']),
  newsController.deleteNews
);

newsRouter.get('/front-page', newsController.getFrontPage);

newsRouter.post('/populate/:query', newsController.populateData);
