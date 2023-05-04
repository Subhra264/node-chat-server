FROM node:16.17.0-alpine
WORKDIR /app

ENV NODE_ENVIRONMENT=development

COPY package*.json ./
RUN npm install
RUN npm run compile:proto

COPY . .
EXPOSE 5000
CMD ["npm", "run", "dev"]