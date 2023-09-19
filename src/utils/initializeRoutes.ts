import { container } from '../config/inversify'
import { CommentRoutes } from '../routes/comment'
import { NewsRoutes } from '../routes/news'
import { UserRoutes } from '../routes/user'
import { TYPES } from '../types/types'

export function initializeRoutes() {
  const commentRoutes = container.get<CommentRoutes>(TYPES.CommentRoutes)
  const newsRoutes = container.get<NewsRoutes>(TYPES.NewsRoutes)
  const userRoutes = container.get<UserRoutes>(TYPES.UserRoutes)

  return [commentRoutes, newsRoutes, userRoutes]
}
