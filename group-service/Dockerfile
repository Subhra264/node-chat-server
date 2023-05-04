FROM node:16.17.0-alpine
WORKDIR /app

ENV NODE_ENVIRONMENT=development

COPY package*.json ./
RUN npm install
RUN npm run prisma:generate
RUN npm run compile-proto

COPY . .
EXPOSE 7000 51051
CMD ["sh", "./run.sh"]