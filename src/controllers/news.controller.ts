import { NewsService } from '../services/news.service';
import { Request, Response } from 'express';
import { isValidMongoId } from '../utils/isValidMongoId';
import { deleteLocalImage } from '../utils/deleteLocalImage';
import { newsCategories } from '../constants/newsCategories';
import axios from 'axios';
import 'dotenv/config';
import * as ERROR_MESSAGES from '../constants/error-messages';
import * as MESSAGES from '../constants/messages';
import { newsPlaceholders } from '../constants/placeholders';
import {
  SHORTENED_ARTICLE_MAX_LENGTH,
  SHORTENED_ARTICLE_MIN_LENGTH,
} from '../constants/numbers';
import { INewsAPIData } from '../interfaces/newsApiData';
import { INews } from '../interfaces/news';
import { RequestWithUserId } from '../interfaces/requestWithUserId';
import { deletePublicFile, uploadPublicFile } from '../utils/image-upload';

export class NewsController {
  constructor(private newsService: NewsService) {}

  getNewsById = async (req: Request, res: Response) => {
    if (!isValidMongoId(req.params.newsId))
      return res
        .status(400)
        .json({ errors: [ERROR_MESSAGES.INVALID_MONGO_ID] });

    const news = await this.newsService.getNewsById(req.params.newsId);
    if (!news)
      return res.status(404).json({ errors: [ERROR_MESSAGES.NEWS_NOT_FOUND] });

    await this.newsService.increaseViewsForNews([news]);

    return res.status(200).json(news);
  };

  createNews = async (req: RequestWithUserId, res: Response) => {
    if (!req.file)
      return res.status(400).json({ errors: ['image must be provided'] });

    // Check if breaking news already exists since only one is allowed to exist
    if (req.body.isBreakingNews) {
      const existingBreakingNews = await this.newsService.getBreakingNews();
      if (existingBreakingNews)
        return res
          .status(400)
          .json({ errors: [ERROR_MESSAGES.BREAKING_NEWS_LIMIT] });
    }

    const imageUrl = await uploadPublicFile(
      req.file.buffer,
      req.file.originalname
    );

    const news = await this.newsService.createNews(
      {
        ...req.body,
        imageUrl,
      },
      req.user!.fullName! // Full name is guaranteed due to middleware
    );

    return res.status(201).json(news);
  };

  updateNews = async (req: RequestWithUserId, res: Response) => {
    if (!isValidMongoId(req.params.newsId))
      return res
        .status(400)
        .json({ errors: [ERROR_MESSAGES.INVALID_MONGO_ID] });

    const existingNews = await this.newsService.getNewsById(req.params.newsId);
    if (!existingNews) {
      return res.status(404).json({ errors: [ERROR_MESSAGES.NEWS_NOT_FOUND] });
    }

    // Check if breaking news already exists since only one is allowed to exist
    if (req.body.isBreakingNews) {
      const existingBreakingNews = await this.newsService.getBreakingNews();
      if (existingBreakingNews && existingBreakingNews.id !== existingNews.id)
        return res
          .status(400)
          .json({ errors: [ERROR_MESSAGES.BREAKING_NEWS_LIMIT] });
    }

    const news = await this.newsService.updateNews(
      req.file?.path
        ? {
            ...req.body,
            imageUrl: await uploadPublicFile(
              req.file.buffer,
              req.file.originalname
            ),
          }
        : req.body,
      req.params.newsId,
      req.user!.fullName! // Full name is guaranteed due to middleware
    );

    req.file?.path && (await deletePublicFile(existingNews.imageUrl));

    return res.status(200).json(news);
  };

  deleteNews = async (req: RequestWithUserId, res: Response) => {
    if (!isValidMongoId(req.params.newsId))
      return res
        .status(400)
        .json({ errors: [ERROR_MESSAGES.INVALID_MONGO_ID] });

    const existingNews = await this.newsService.getNewsById(req.params.newsId);
    if (!existingNews) {
      return res.status(404).json({ errors: [ERROR_MESSAGES.NEWS_NOT_FOUND] });
    }

    await this.newsService.deleteNews(req.params.newsId);

    await deletePublicFile(existingNews.imageUrl);

    return res.status(200).json({ message: MESSAGES.DELETE_SUCCESS });
  };

  getFrontPage = async (req: Request, res: Response) => {
    const news = await this.newsService.getFrontPageNews();

    return res.status(200).json(news);
  };

  populateData = async (req: Request, res: Response) => {
    const { data } = (await axios.get(
      `${process.env.NEWSAPI_BASE_URL}/everything?q=${req.params.query}&sortBy=publishedAt&apiKey=${process.env.NEWSAPI_KEY}`
    )) as INewsAPIData;

    if (data.status !== 'ok')
      return res.status(500).json({ errors: ['newsapi failed to respond'] });

    const newsToPopulate: Partial<INews>[] = data.articles.map((article) => {
      // Add placeholders because all of these vaules can be empty
      if (!article.description)
        article.description = newsPlaceholders.description;
      if (!article.urlToImage) article.urlToImage = newsPlaceholders.urlToImage;
      if (!article.author) article.author = newsPlaceholders.author;

      return {
        createdBy: article.author,
        lastEditedBy: article.author,
        headline: article.title,
        shortDescription:
          article.description.length > SHORTENED_ARTICLE_MAX_LENGTH
            ? article.description.slice(
                SHORTENED_ARTICLE_MIN_LENGTH,
                SHORTENED_ARTICLE_MAX_LENGTH
              ) + '...'
            : article.description,
        fullDescription: article.description,
        createdAt: new Date(article.publishedAt),
        lastEditedAt: new Date(article.publishedAt),
        imageUrl: article.urlToImage,
        category:
          newsCategories[Math.floor(Math.random() * newsCategories.length)], // select random category
      };
    });

    const populatedNews = await this.newsService.populateNews(newsToPopulate);

    return res.status(201).json({ populatedNews });
  };
}
