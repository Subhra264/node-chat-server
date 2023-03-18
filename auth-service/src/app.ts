import express, { Request, Response } from 'express';

if (process.env.NODE_ENVIRONMENT !== 'production') {
  require('dotenv').config();
}

const app = express();
const PORT = process.env.PORT || 7000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    message: 'OK',
  });
});

app.listen(PORT, () => {
  console.log(`Auth service listening at port ${PORT}`);
});
