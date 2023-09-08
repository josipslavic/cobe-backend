import express from 'express';
import bodyParser from 'body-parser';
import { userRouter } from './routes/user';
import { newsRouter } from './routes/news';
import { commentRouter } from './routes/comment';
import { swaggerDocs } from './swagger-docs';
import mongoose from 'mongoose';
import cloudinary from 'cloudinary';
import 'dotenv/config';

const app = express();
const port = 3000;

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

mongoose.connect(process.env.MONGO_URI as string);

app.use(bodyParser.json());

app.use('/uploads', express.static('uploads'));

app.use('/auth', userRouter);
app.use('/news', newsRouter);
app.use('/comment', commentRouter);

app.listen(port, () => {
  console.log(`App running on port ${port}`);
  swaggerDocs(app, port);
});
