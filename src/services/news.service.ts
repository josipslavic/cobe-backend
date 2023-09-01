import { Model } from 'mongoose';
import { INews, NewsDto } from '../models/News';
import { newsCategories } from '../constants/newsCategories';

export class NewsService {
  constructor(public readonly newsModel: Model<INews>) {
    this.newsModel = newsModel;
  }

  async getNewsById(newsId: string) {
    return await this.newsModel.findOne({ _id: newsId });
  }

  async getBreakingNews() {
    return await this.newsModel.findOne({ isBreakingNews: true });
  }

  async createNews(createNewsDto: NewsDto, creatorName: string) {
    const news = await this.newsModel.create({
      ...createNewsDto,
      createdBy: creatorName,
      lastEditedBy: creatorName,
    });
    return await news.save();
  }

  async populateNews(newsArray: Partial<INews>[]) {
    const createdNews = await this.newsModel.create(newsArray);
    return createdNews;
  }

  async updateNews(
    updateNewsDto: Partial<NewsDto>,
    newsId: string,
    editorName: string
  ) {
    return await this.newsModel.findOneAndUpdate(
      { _id: newsId },
      { ...updateNewsDto, lastEditedBy: editorName, lastEditedAt: Date.now() }, // TODO: How can you handle different time zones?
      { new: true }
    );
  }

  async deleteNews(newsId: string) {
    return await this.newsModel.findOneAndRemove({ _id: newsId }).exec();
  }

  async getFrontPageNews() {
    let frontPageNews: INews[] = [];

    // Get breaking news first
    const breakingNews = await this.getBreakingNews();
    if (breakingNews) frontPageNews.push(breakingNews);

    // Get up to 4 news from each category
    newsCategories.forEach((category) => {
      this.newsModel
        .find({ category })
        .limit(4)
        .sort({ createdAt: -1 })
        .select('-views')
        .then((newsItems) => {
          frontPageNews = [...frontPageNews, ...newsItems];
        })
        .catch((error) => console.error(error));
    });

    await this.increaseViewsForNews(frontPageNews);

    return frontPageNews;
  }

  async increaseViewsForNews(newsArray: INews[]) {
    const newsIds = newsArray.map((news) => news._id);

    await this.newsModel
      .updateMany(
        { _id: { $in: newsIds } },
        { $inc: { views: 1 } },
        { new: true }
      )
      .exec();
  }
}
