import { Router } from 'express';
import { validateBody } from '../middleware/validateBody';
import { INews, NewsDto, NewsModel } from '../models/News';
import { RequestWithUserId, isAuth } from '../middleware/isAuth';
import { NewsService } from '../services/news.service';
import { upload } from '../utils/multerUpload';
import { requireRoles } from '../middleware/requireRoles';
import { unlink } from 'fs/promises';
import axios from 'axios';
import { newsCategories } from '../constants/newsCategories';
import 'dotenv/config';

export const newsRouter = Router();

newsRouter.get('/front-page', async (req, res) => {
  console.log('called fornt page');
  const newsService = new NewsService(NewsModel);
  const news = await newsService.getFrontPageNews();
  return res.status(200).json(news);
});

newsRouter.get('/:newsId', isAuth, async (req, res) => {
  const newsService = new NewsService(NewsModel);
  const news = await newsService.getNewsById(req.params.newsId);

  if (!news) return res.status(404).json({ errors: ['news not found'] });

  await newsService.increaseViewsForNews([news]);

  return res.status(200).json(news);
});

newsRouter.post(
  '/',
  upload.single('image'),
  validateBody(NewsDto),
  isAuth,
  requireRoles(['admin', 'editor']),
  async (req: RequestWithUserId, res) => {
    if (!req.file?.path)
      return res.status(400).json({ errors: ['image must be provided'] });

    const newsService = new NewsService(NewsModel);

    // Check if breaking news already exists since only one is allowed to exist
    if (req.body.isBreakingNews) {
      const existingBreakingNews = await newsService.getBreakingNews();
      if (existingBreakingNews)
        return res
          .status(400)
          .json({ errors: ['only one breaking news is alowed'] });
    }

    const news = await newsService.createNews(
      { ...req.body, imageUrl: req.file.path },
      req.user!.fullName! // Full name is guaranteed due to middleware
    );
    return res.status(201).json(news);
  }
);

newsRouter.patch(
  '/:newsId',
  upload.single('image'),
  validateBody(NewsDto, true),
  isAuth,
  requireRoles(['admin', 'editor']),
  async (req: RequestWithUserId, res) => {
    const newsService = new NewsService(NewsModel);

    const existingNews = await newsService.getNewsById(req.params.newsId);

    if (!existingNews) {
      return res.status(404).json({ errors: ['news not found'] });
    }

    // Check if breaking news already exists since only one is allowed to exist
    if (req.body.isBreakingNews) {
      const existingBreakingNews = await newsService.getBreakingNews();
      if (existingBreakingNews && existingBreakingNews.id !== existingNews.id)
        return res
          .status(400)
          .json({ errors: ['only one breaking news is alowed'] });
    }

    const news = await newsService.updateNews(
      req.file?.path ? { ...req.body, imageUrl: req.file.path } : req.body,
      req.params.newsId,
      req.user!.fullName! // Full name is guaranteed due to middleware
    );

    req.file?.path && (await unlink(existingNews.imageUrl));

    return res.status(200).json(news);
  }
);

newsRouter.delete(
  '/:newsId',
  isAuth,
  requireRoles(['admin']),
  async (req: RequestWithUserId, res) => {
    const newsService = new NewsService(NewsModel);

    const existingNews = await newsService.getNewsById(req.params.newsId);

    if (!existingNews) {
      return res.status(404).json({ errors: ['news not found'] });
    }

    await newsService.deleteNews(req.params.newsId);

    await unlink(existingNews.imageUrl);

    return res.status(200).json({ message: 'News deleted successfully' });
  }
);

newsRouter.post('/populate/:query', async (req, res) => {
  const { data } = (await axios.get(
    `https://newsapi.org/v2/everything?q=${req.params.query}&sortBy=publishedAt&apiKey=${process.env.NEWSAPI_KEY}`
  )) as {
    data: {
      status: string;
      articles: {
        source: {
          id: string | null;
          name: string;
        };
        author: string;
        title: string;
        description: string;
        url: string;
        urlToImage: string;
        publishedAt: string;
        content: string;
      }[];
    };
  };

  if (data.status !== 'ok')
    return res.status(500).json({ errors: ['newsapi failed to respond'] });

  const newsService = new NewsService(NewsModel);

  const newsToPopulate: Partial<INews>[] = data.articles.map((article) => {
    // Add placeholders because all of these vaules can be empty
    if (!article.description) article.description = ' ';
    if (!article.urlToImage)
      article.urlToImage =
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/681px-Placeholder_view_vector.svg.png';
    if (!article.author) article.author = 'Unkown author';

    return {
      createdBy: article.author,
      lastEditedBy: article.author,
      headline: article.title,
      shortDescription:
        article.description.length > 20
          ? article.description.slice(0, 20) + '...'
          : article.description,
      fullDescription: article.description,
      createdAt: new Date(article.publishedAt),
      lastEditedAt: new Date(article.publishedAt),
      imageUrl: article.urlToImage,
      category: newsCategories[Math.floor(Math.random() * 3)], // select random category
    };
  });

  const populatedNews = await newsService.populateNews(newsToPopulate);

  return res.status(200).json({ populatedNews });
});
