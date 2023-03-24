import express, { NextFunction, Request, Response } from 'express';
import httpErrors, { HttpError } from './errors/http-errors';
import routes from './routes';

if (process.env.NODE_ENVIRONMENT !== 'production') {
  require('dotenv').config();
}

const app = express();
const PORT = process.env.PORT || 7000;

app.use(express.json());

routes.forEach((route) => {
  app.use(route[0], route[1]);
});

app.use(async (_: Request, __: Response, next: NextFunction) => {
  next(httpErrors.NotFound());
});

app.use(async (err: HttpError, _: Request, res: Response) => {
  res.json({
    status: 'error',
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Auth service listening at port ${PORT}`);
});
