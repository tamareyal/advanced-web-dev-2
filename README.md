# advanced-web-dev

A small Express (TypeScript) + Mongoose API for posts and comments.

## Configuration

Create a `.env` file and set the MongoDB URI:

```
MONGO_URI=mongodb://localhost:27017/mydatabase
PORT=3000
```

## Install

```sh
npm install
```

## Run

- Development (auto-restarts):  
  ```sh
  npm run dev
  ```
- Build and run (production-like):  
  ```sh
  npm run start
  ```

## API

- Posts: /api/posts (routes in [routes/postsRoutes.ts](routes/postsRoutes.ts))
- Comments: /api/comments (routes in [routes/commentsRoutes.ts](routes/commentsRoutes.ts))

Example requests are provided in [rests/posts.rest](rests/posts.rest) and [rests/comments.rest](rests/comments.rest).

Quick curl example:

```sh
curl http://localhost:3000/api/posts
```
