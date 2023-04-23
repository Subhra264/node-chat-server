# Node-chat-server

![node-chat-server-HLD](https://user-images.githubusercontent.com/59690052/233828851-03403b4a-70b0-4170-8987-8147ab8415ed.png)

This is a side project that was stared in April of the year 2021. The main goal was to build a production-ready, error-resistant, fast, and highly scalable chatting server with support for groups, text channels, voice channels, and self-messaging. It was first developed as a monolithic architecture with [**Redis caching**](https://redis.com/solutions/use-cases/caching/) and its [**publisher/subscriber**](https://redis.io/docs/manual/pubsub/) system integrated to establish communication between horizontally scaled server processes.

However, recently the whole codebaes is being revamped to move to microservice architecture with `gRPC` support for information exchange between independently running services. Also, here instead of using `mongoose`, `Prisma` is used to easily move to another DB (e.g. `PostgreSQL`) with minimal changes if required.

# Architecture

Currently, these are the services present in this architecture-

- **auth** - Responsible for authentication and `JWT` token validation. All other services call this service to validate the JWT access token. Besides running `gRPC` server, it also provides a REST client for the end users. `Prisma` is used to handle `MongoDB` database connection and operations.
- **rest** - Provides all the major REST APIs (CRUD APIs for groups, channels, self messages, etc.) for clients. For now, `mongoose` is used for `MongoDB` operations.
- **group** - Exposes a public `REST` API to fetch group information, add members, add channels, and do all the group-specific activities. Also, there is a `gRPC` server that the `socket` service uses to retrieve the member lists of the group. `Prisma` is used to handle database operations. Depends on the `auth` service to check `JWT` authentication.
- **message** - Provides `gRPC` API for socket service to save new messages. Connected to `auth` service through `gRPC` to validate authorization.
- **socket** - Responsible for opening `socket` connections between server and client. Authentication is required to establish the connection, hence using `auth` service through `gRPC`. In a chat application, database reads for messages are significantly low compared to database writes.

There would be three ways to save messages in the database —

- The message is saved in the database through `REST` API asynchronously and also at the same time it is sent to the socket server. This workflow is terrible since there is no consistency at all. The message may not be saved in the database for some erroneous reasons but is successfully broadcasted to the recipients. Overall the UX would not be good at all.
- First, call the `REST` API to save the message in the Database. If the response is `OK`, then send it to the socket server which will broadcast the message to all other group members or friends.

The problem here is the delay. The `REST` request may take some time because, for each message, it creates a costly `TCP` connection to a remote server placed somewhere in the world and the server then writes the message in the database and finally returns the response.

The whole process is costly. Imagine you are spamming in a group channel at your full speed and your browser ends up creating lots and lots of `TCP` `REST` requests. Message brokers can obviously be used but that helps the server side only.

- Another way would be to pass the message to the socket server which ultimately saves the message through a `gRPC` call to the message service. The benefit here is that the browser doesn’t need to create tons and tons of `TCP` connections to the server. There is only one `TCP` connection to the socket server and `gRPC` uses binary `protobuf` protocol for communication which is way faster than the `REST` thing.

After the message is saved in the database, the socket server can pass the acknowledgment receipt back to the socket client and asynchronously broadcast the message to other socket clients. And again something like `RabbitMQ` can be used to prevent the Database from getting bombarded with write requests.

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
