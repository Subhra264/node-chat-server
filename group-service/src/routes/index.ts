import { Router } from 'express';
import GroupRouter from './api/GroupRouter';
import MemberRouter from './api/MemberRoute';

const routes: Array<[string, Router]> = [
  ['/', GroupRouter],
  ['/members', MemberRouter],
];

export default routes;
