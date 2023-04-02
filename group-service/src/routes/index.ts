import { Router } from 'express';
import GroupRouter from './api/GroupRouter';

const routes: Array<[string, Router]> = [['/', GroupRouter]];

export default routes;
