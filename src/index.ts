import bodyParser from 'body-parser'
import 'dotenv/config'
import express from 'express'

import { createConfigs } from './config'
import { errorHandler } from './middleware/errorHandler'
import { commentRouter } from './routes/comment'
import { newsRouter } from './routes/news'
import { userRouter } from './routes/user'
import { swaggerDocs } from './swagger-docs'

const app = express()
const port = 3000

app.use(bodyParser.json())

app.use('/uploads', express.static('uploads'))

app.use('/auth', userRouter)
app.use('/news', newsRouter)
app.use('/comment', commentRouter)

app.use(errorHandler)

app.listen(port, () => {
  createConfigs()
  console.log(`App running on port ${port}`)
  swaggerDocs(app, port)
})
