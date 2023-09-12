import express from 'express';
import bodyParser from 'body-parser';
import { userRouter } from './routes/user';
import { newsRouter } from './routes/news';
import { commentRouter } from './routes/comment';
import { errorHandler } from './middleware/errorHandler';
import { createConfigs } from './config';
import { swaggerDocs } from './swagger-docs';
import 'dotenv/config';

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use('/uploads', express.static('uploads'));

app.use('/auth', userRouter);
app.use('/news', newsRouter);
app.use('/comment', commentRouter);

app.use(errorHandler);

app.listen(port, () => {
  createConfigs();
  console.log(`App running on port ${port}`);
  swaggerDocs(app, port);
});
