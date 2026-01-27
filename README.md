# advanced-web-dev

A small Express (TypeScript) + Mongoose API for posts and comments.

## Configuration

Create a `.env` file and set the MongoDB URI:

```
MONGO_URI=mongodb://localhost:27017/mydatabase
PORT=3000
```

For testing, create a `.env.test` file:

```
MONGO_URI=mongodb://localhost:27017/testdatabase
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

## Testing

Run tests using Jest:

```sh
npm test
```

The project uses Jest with TypeScript (`ts-jest`) for testing. Tests are located in the `tests/` directory and cover:
- Authentication (register, login, token refresh)
- Posts API (CRUD operations)
- Comments API (CRUD operations)
- Users API (CRUD operations)

Test setup automatically:
- Starts a test server
- Connects to the test database
- Clears the database before running tests
- Creates a test user for authenticated requests

## API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with username/email and password
- `POST /api/auth/refresh-token` - Refresh access tokens

### Users (`/api/users`)
- `GET /api/users` - Get all users (requires authentication)
- `GET /api/users/:id` - Get user by ID (requires authentication)
- `PUT /api/users/:id` - Update user (requires authentication and ownership)
- `DELETE /api/users/:id` - Delete user (requires authentication and ownership)

### Posts (`/api/posts`)
- `GET /api/posts` - Get all posts (supports query filtering, requires authentication)
- `POST /api/posts` - Create a new post (requires authentication)
- `GET /api/posts/:id` - Get post by ID (requires authentication)
- `PUT /api/posts/:id` - Update post (requires authentication and ownership)
- `DELETE /api/posts/:id` - Delete post (requires authentication and ownership)

### Comments (`/api/comments`)
- `GET /api/comments` - Get all comments (supports query filtering, requires authentication)
- `POST /api/comments` - Create a new comment (requires authentication)
- `GET /api/comments/:id` - Get comment by ID (requires authentication)
- `GET /api/comments/posts/:postId` - Get all comments for a specific post (requires authentication)
- `PUT /api/comments/:id` - Update comment (requires authentication and ownership)
- `DELETE /api/comments/:id` - Delete comment (requires authentication and ownership)

## API Documentation (Swagger)

Interactive API documentation is available via Swagger UI at:

```
http://localhost:3000/api/docs
```

The Swagger interface provides:
- Complete API endpoint documentation
- Request/response schemas
- Interactive testing capabilities
- Authentication support (Bearer tokens)

## Example Requests

Example requests are provided in REST client format:
- [rests/posts.rest](rests/posts.rest) - Posts API examples
- [rests/comments.rest](rests/comments.rest) - Comments API examples
- [rests/users.rest](rests/users.rest) - Users API examples

Quick curl example (authentication required):

```sh
# Register a user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Get all posts (replace TOKEN with your JWT token)
curl -X GET http://localhost:3000/api/posts \
  -H "Authorization: Bearer TOKEN"
```