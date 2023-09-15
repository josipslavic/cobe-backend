import { Container } from 'inversify'
import { Model } from 'mongoose'

import { CommentController } from '../controllers/comment.controller'
import { NewsController } from '../controllers/news.controller'
import { UserController } from '../controllers/user.controller'
import { IComment } from '../interfaces/comment'
import { INews } from '../interfaces/news'
import { IUser } from '../interfaces/user'
import { CommentModel } from '../models/Comment'
import { NewsModel } from '../models/News'
import { UserModel } from '../models/User'
import { CommentService } from '../services/comment.service'
import { NewsService } from '../services/news.service'
import { UserService } from '../services/user.service'
import { TYPES } from '../types/types'

export const container = new Container()

container.bind<Model<IUser>>(TYPES.UserModel).toConstantValue(UserModel)
container.bind<UserService>(TYPES.UserService).to(UserService)
container.bind<UserController>(TYPES.UserController).to(UserController)

container.bind<Model<INews>>(TYPES.NewsModel).toConstantValue(NewsModel)
container.bind<NewsService>(TYPES.NewsService).to(NewsService)
container.bind<NewsController>(TYPES.NewsController).to(NewsController)

container
  .bind<Model<IComment>>(TYPES.CommentModel)
  .toConstantValue(CommentModel)
container.bind<CommentService>(TYPES.CommentService).to(CommentService)
container.bind<CommentController>(TYPES.CommentController).to(CommentController)
