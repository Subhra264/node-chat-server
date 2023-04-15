import { NextFunction, Request, Response } from 'express';

export interface AuthenticatedRequest extends Request {
  userId: string;
  username: string;
}

export default async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
  } catch (err) {}
}
