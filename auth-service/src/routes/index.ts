import { Router } from 'express';
import AuthRouter from './api/AuthRouter';

const routes: Array<[string, Router]> = [['/auth', AuthRouter]];

export default routes;
