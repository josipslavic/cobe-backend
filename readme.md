# COBE Backend

## Getting started

- Clone the repository

```
git clone git@github.com:josipslavic/cobe-backend.git cobe-backend
```

- Install dependencies

```
cd cobe-backend
npm install
```

- Build and run the project

```
npm start
```

Navigate to `http://localhost:3000`

- API Document endpoints

  swagger-ui Endpoint : http://localhost:3000/api-docs

## Environment vars

This project uses the following environment variables:

| Name             | Description                     | Default Value                                                                           |
| ---------------- | ------------------------------- | --------------------------------------------------------------------------------------- |
| JWT_KEY          | JWT secret                      | "jwtkey"                                                                                |
| JWT_EXPIRES_IN   | JWT time to expiry              | "2h"                                                                                    |
| MONGO_URI        | Your Mongodb Atlas URI          | mongodb+srv://username:password@yourdatabase.mongodb.net/?retryWrites=true&w=majority   |
| NEWSAPI_BASE_URL | Current base url to newsapi     | "https://newsapi.org/v2"                                                                |
| NEWSAPI_KEY      | API key to https://newsapi.org/ | yournewsapikey                                                                          |
| CLOUD_NAME       | Cloudinary cloud name           | cloudname                                                                               |
| API_KEY          | Cloudinary API key              | apikey                                                                                  |
| API_SECRET       | Cloudinary API secret           | apisecret                                                                               |

## Available npm scripts

| Npm Script  | Description                                                            |
| ----------- | ---------------------------------------------------------------------- |
| `start:dev` | Runs development server via nodemon                                    |
| `build`     | Removes the current build folder (if it exists) and creates a new one  |
| `start`     | Does the same thing as `build` but also runs the server upon compiling |
