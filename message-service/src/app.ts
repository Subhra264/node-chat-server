import Express, { NextFunction, Request, Response } from 'express';
import AuthMiddleware from './middlewares/AuthMiddleware';
import routers from './routes';

const app = Express();
const PORT = process.env.PORT || 9000;

app.use(Express.json());
app.use(AuthMiddleware);

routers.forEach((router) => {
  app.use(...router);
});

app.use(async (req: Request, _: Response, next: NextFunction) => {});

app.listen(PORT, () => {
  console.log('Listening to port', PORT);
});
