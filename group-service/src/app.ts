import express, { NextFunction, Request, Response } from 'express';
import routes from './routes';
import HttpErrors, { HttpError } from './errors/http-errors';
import GRPCAuthClient from './grpc/GRPCAuthClient';
import AuthMiddleware from './middlewares/AuthMiddleware';

if (process.env.NODE_ENVIRONMENT !== 'production') {
  require('dotenv').config();
}

const app = express();
const PORT = process.env.PORT || 7000;
const grpcAuthClient = GRPCAuthClient.client;
grpcAuthClient.loadProto();

app.use(express.json());
app.use(AuthMiddleware);
routes.forEach((route) => {
  app.use(route[0], route[1]);
});

app.use((_: Request, __: Response, next: NextFunction) => {
  next(HttpErrors.NotFound());
});

app.use((err: HttpError, _: Request, res: Response) => {
  res.status(err.status).json({
    status: 'error',
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
