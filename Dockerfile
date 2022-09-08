FROM node:16

WORKDIR /use/src/app

COPY package.json yarn.lock ./
RUN yarn
COPY . .

EXPOSE 8000
CMD yarn build:cpp && yarn dev