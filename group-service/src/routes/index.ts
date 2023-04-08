import { Router } from 'express';
import GroupRouter from './api/GroupRouter';
import MemberRouter from './api/MemberRouter';
import ChannelRouter from './api/ChannelRouter';

const routes: Array<[string, Router]> = [
  ['/', GroupRouter],
  ['/members', MemberRouter],
  ['/channels', ChannelRouter],
];

export default routes;
