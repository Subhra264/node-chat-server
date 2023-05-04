FROM node:16.17.0-alpine
WORKDIR /app

ENV NODE_ENVIRONMENT=development

COPY package*.json ./
RUN npm install
RUN npm run prisma:generate
RUN npm run grpc:proto

COPY . .
EXPOSE 6000 50051
CMD ["sh", "./run.sh"]