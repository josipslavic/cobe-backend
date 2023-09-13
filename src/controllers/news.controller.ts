import { NewsService } from '../services/news.service';
import { NextFunction, Request, Response } from 'express';
import { isValidMongoId } from '../utils/isValidMongoId';
import { newsCategories } from '../constants/newsCategories';
import axios from 'axios';
import 'dotenv/config';
import { newsPlaceholders } from '../constants/placeholders';
import { INewsAPIData } from '../interfaces/newsApiData';
import { INews } from '../interfaces/news';
import { RequestWithUserId } from '../interfaces/requestWithUserId';
import { deletePublicFile, uploadPublicFile } from '../utils/image-upload';
import { trimDescription } from '../utils/trimDescription';
import { commonErrors } from '../constants/commonErrors';
import { successResponses } from '../constants/successRespones';
import * as MESSAGES from '../constants/messages';

export class NewsController {
  constructor(private newsService: NewsService) {}

  getNewsById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!isValidMongoId(req.params.newsId)) throw commonErrors.invalidMongoId;

      const news = await this.newsService.getNewsById(req.params.newsId);
      if (!news) throw commonErrors.newsNotFound;

      await this.newsService.increaseViewsForNews([news]);

      return successResponses.ok(res, news);
    } catch (error) {
      next(error);
    }
  };

  createNews = async (
    req: RequestWithUserId,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.file) throw commonErrors.noImage;

      // Check if breaking news already exists since only one is allowed to exist
      if (req.body.isBreakingNews) {
        const existingBreakingNews = await this.newsService.getBreakingNews();
        if (existingBreakingNews) throw commonErrors.breakingNewsLimit;
      }

      const { imageUrl, imageId } = await uploadPublicFile(req.file);

      const news = await this.newsService.createNews(
        {
          ...req.body,
          imageUrl,
          imageId,
        },
        req.user!.fullName! // Full name is guaranteed due to middleware
      );

      return successResponses.created(res, news);
    } catch (error) {
      next(error);
    }
  };

  updateNews = async (
    req: RequestWithUserId,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!isValidMongoId(req.params.newsId)) throw commonErrors.invalidMongoId;

      const existingNews = await this.newsService.getNewsById(
        req.params.newsId
      );
      if (!existingNews) {
        throw commonErrors.newsNotFound;
      }

      // Check if breaking news already exists since only one is allowed to exist
      if (req.body.isBreakingNews) {
        const existingBreakingNews = await this.newsService.getBreakingNews();
        if (existingBreakingNews && existingBreakingNews.id !== existingNews.id)
          throw commonErrors.breakingNewsLimit;
      }

      const news = await this.newsService.updateNews(
        req.file?.path
          ? {
              ...req.body,
              ...(await uploadPublicFile(req.file)),
            }
          : req.body,
        req.params.newsId,
        req.user!.fullName! // Full name is guaranteed due to middleware
      );

      if (req.file && existingNews.imageId)
        await deletePublicFile(existingNews.imageId);

      return successResponses.ok(res, news);
    } catch (error) {
      next(error);
    }
  };

  deleteNews = async (
    req: RequestWithUserId,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!isValidMongoId(req.params.newsId)) throw commonErrors.invalidMongoId;

      const existingNews = await this.newsService.getNewsById(
        req.params.newsId
      );
      if (!existingNews) {
        throw commonErrors.newsNotFound;
      }

      await this.newsService.deleteNews(req.params.newsId);

      if (existingNews.imageId) await deletePublicFile(existingNews.imageId);

      return successResponses.ok(res, MESSAGES.DELETE_SUCCESS);
    } catch (error) {
      next(error);
    }
  };

  getFrontPage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const news = await this.newsService.getFrontPageNews();

      return successResponses.ok(res, news);
    } catch (error) {
      next(error);
    }
  };

  populateData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { data } = (await axios.get(
        `${process.env.NEWSAPI_BASE_URL}/everything?q=${req.params.query}&sortBy=publishedAt&apiKey=${process.env.NEWSAPI_KEY}`
      )) as INewsAPIData;

      if (data.status !== 'ok') throw commonErrors.newsApi;

      const newsToPopulate: Partial<INews>[] = data.articles.map((article) => {
        // Add placeholders because all of these vaules can be empty
        if (!article.description)
          article.description = newsPlaceholders.description;
        if (!article.urlToImage)
          article.urlToImage = newsPlaceholders.urlToImage;
        if (!article.author) article.author = newsPlaceholders.author;

        return {
          createdBy: article.author,
          lastEditedBy: article.author,
          headline: article.title,
          shortDescription: trimDescription(article.description),
          fullDescription: article.description,
          createdAt: new Date(article.publishedAt),
          lastEditedAt: new Date(article.publishedAt),
          imageUrl: article.urlToImage,
          category:
            newsCategories[Math.floor(Math.random() * newsCategories.length)], // select random category
        };
      });

      const populatedNews = await this.newsService.populateNews(newsToPopulate);

      return successResponses.created(res, populatedNews);
    } catch (error) {
      next(error);
    }
  };
}
