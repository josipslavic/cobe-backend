import bodyParser from 'body-parser'
import express, { Express } from 'express'
import { inject, injectable } from 'inversify'

import { cloudinaryConfig } from './config/cloudinary'
import { mongooseConfig } from './config/mognoose'
import { IRoute } from './interfaces/route'
import { errorHandler } from './middleware/errorHandler'
import { CommentRoutes } from './routes/comment'
import { NewsRoutes } from './routes/news'
import { UserRoutes } from './routes/user'
import { TYPES } from './types/types'

@injectable()
export class AppBootstrap {
  public app: Express
  private routes: IRoute[]

  constructor(
    @inject(TYPES.UserRoutes)
    userRoutes: UserRoutes,
    @inject(TYPES.NewsRoutes)
    newsRoutes: NewsRoutes,
    @inject(TYPES.CommentRoutes)
    commentRoutes: CommentRoutes
  ) {
    this.app = express()
    this.routes = [userRoutes, newsRoutes, commentRoutes]

    this.setMiddleware()
    this.setConfig()
  }

  private setMiddleware() {
    this.app.use(bodyParser.json())
    this.app.use('/uploads', express.static('uploads'))

    this.routes.forEach((route) =>
      this.app.use(route.getPath(), route.getRouter())
    )

    this.app.use(errorHandler)
  }

  private setConfig() {
    mongooseConfig()
    cloudinaryConfig()
  }
}
