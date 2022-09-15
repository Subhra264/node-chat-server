FROM node:16.17.0-alpine AS BUILD_WITH_NODE_GYP
WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package.json package-lock.json binding.gyp ./
COPY ./src/cpplib ./src/cpplib
RUN npm i -g node-gyp && npm ci && npm run build:cpp

FROM node:16.17.0-alpine
WORKDIR /src

COPY --from=BUILD_WITH_NODE_GYP /app/node_modules ./node_modules
COPY --from=BUILD_WITH_NODE_GYP /app/build ./build

COPY . .

EXPOSE 8000
CMD [ "npm", "run", "dev" ]