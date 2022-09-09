FROM node:16

WORKDIR /src

COPY package.json yarn.lock ./
RUN npm install -g yarn && yarn ci && yarn add -g node-gyp
COPY . .

EXPOSE 8000
CMD [ "yarn", "dev:cpp" ]