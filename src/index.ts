import 'dotenv/config'
import 'reflect-metadata'

import { AppBootstrap } from './app-bootstrap'
import { container } from './config/inversify'
import { swaggerDocs } from './swagger-docs'
import { TYPES } from './types/types'

const port = 3000

const { app } = container.get<AppBootstrap>(TYPES.AppBootstrap)

app.listen(port, () => {
  console.log(`App running on port ${port}`)
  swaggerDocs(app, port)
})
