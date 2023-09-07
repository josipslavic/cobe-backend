import express from 'express';
import bodyParser from 'body-parser';
import { userRouter } from './routes/user';
import { newsRouter } from './routes/news';
import { commentRouter } from './routes/comment';
import { swaggerDocs } from './swagger-docs';
import mongoose from 'mongoose';
import 'dotenv/config';
import path from 'path';

const app = express();
const port = 3000;

mongoose.connect(process.env.MONGO_URI as string);

app.use(bodyParser.json());

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/uploads', express.static('uploads'));

app.use('/auth', userRouter);
app.use('/news', newsRouter);
app.use('/comment', commentRouter);

app.listen(port, () => {
  console.log(`App running on port ${port}`);
  swaggerDocs(app, port);
});
