# Node-chat-server

This is the backend for [Node-Chat-Client](https://github.com/Subhra264/node-chat-web-client). Microservice based architecture that uses GRPC to establish communication between services. For now, there are only three services -

- **auth** - Responsible for authentication and `JWT` token validation. All other services call this service to validate the JWT access token. Besides running `GRPC` server, it also provides a REST client for the end users. `Prisma` is used to handle `MongoDB` database connection and operations.
- **rest** - Provides all the major REST APIs (CRUD APIs for groups, channels, self messages etc.) for client. In future, it may be broken into three or four different services including self message, groups and channels. For now, `mongoose` is used for `MongoDB` operations.
- **socket** - Responsible for opening `socket` connections between server and client. Authentication is required to establish the connection and hence uses `auth` service through GRPC.

## Technologies used:

- Node.js
- Express
- Mongoose
- Prisma
- grpc
- Typescript
- JWT
- Socket.io
- Redis
- Bcrypt
- Docker
- NGINX
- Github Actions
- C++ (No use for now)
