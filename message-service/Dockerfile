FROM node:16.17.0-alpine
WORKDIR /app

ENV NODE_ENVIRONMENT=development

COPY package*.json ./
RUN npm install
RUN npm run prisma:generate
RUN npm run load-proto

COPY . .
EXPOSE 9000 52051
CMD ["sh", "./run.sh"]