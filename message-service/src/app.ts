import Express, { NextFunction, Request, Response } from 'express';
import AuthMiddleware from './middlewares/AuthMiddleware';
import routers from './routes';
import HttpErrors, { HttpError } from './errors/http-errors';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv');
}

const app = Express();
const PORT = process.env.PORT || 9000;

app.use(Express.json());
app.use(AuthMiddleware);

routers.forEach((router) => {
  app.use(...router);
});

app.use(async (_: Request, __: Response, next: NextFunction) => {
  next(HttpErrors.NotFound());
});

app.use((err: HttpError, _: Request, res: Response) => {
  res.status(err.status).json({
    status: 'error',
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log('Listening to port', PORT);
});
