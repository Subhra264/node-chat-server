import express, { NextFunction, Request, Response } from 'express';
import routes from './routes';

const app = express();
const PORT = process.env.PORT || 7000;

routes.forEach((route) => {
  app.use(route[0], route[1]);
});

app.use((_: Request, __: Response, next: NextFunction) => {
  next(new Error('NOT_FOUND'));
});

app.use((err: Error, _: Request, res: Response) => {
  res.json({
    status: 'error',
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
