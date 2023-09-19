import bodyParser from 'body-parser'
import 'dotenv/config'
import express from 'express'
import 'reflect-metadata'

import { createConfigs } from './config'
import { errorHandler } from './middleware/errorHandler'
import { swaggerDocs } from './swagger-docs'
import { initializeRoutes } from './utils/initializeRoutes'

const app = express()
const port = 3000

app.use(bodyParser.json())

app.use('/uploads', express.static('uploads'))

initializeRoutes().forEach((route) =>
  app.use(route.getPath(), route.getRouter())
)

app.use(errorHandler)

app.listen(port, () => {
  createConfigs()
  console.log(`App running on port ${port}`)
  swaggerDocs(app, port)
})
