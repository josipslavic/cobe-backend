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
import { CommentRoutes } from '../routes/comment'
import { NewsRoutes } from '../routes/news'
import { UserRoutes } from '../routes/user'
import { CommentService } from '../services/comment.service'
import { NewsService } from '../services/news.service'
import { UserService } from '../services/user.service'
import { TYPES } from '../types/types'
import { AppBootstrap } from '../app-bootstrap'

export const container = new Container()

container.bind<Model<IUser>>(TYPES.UserModel).toConstantValue(UserModel)
container.bind<Model<INews>>(TYPES.NewsModel).toConstantValue(NewsModel)
container
  .bind<Model<IComment>>(TYPES.CommentModel)
  .toConstantValue(CommentModel)

container.bind<UserService>(TYPES.UserService).to(UserService)
container.bind<NewsService>(TYPES.NewsService).to(NewsService)
container.bind<CommentService>(TYPES.CommentService).to(CommentService)

container.bind<UserController>(TYPES.UserController).to(UserController)
container.bind<NewsController>(TYPES.NewsController).to(NewsController)
container.bind<CommentController>(TYPES.CommentController).to(CommentController)

container.bind<UserRoutes>(TYPES.UserRoutes).to(UserRoutes)
container.bind<NewsRoutes>(TYPES.NewsRoutes).to(NewsRoutes)
container.bind<CommentRoutes>(TYPES.CommentRoutes).to(CommentRoutes)

container.bind<AppBootstrap>(TYPES.AppBootstrap).to(AppBootstrap)
