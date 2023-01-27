import { Router, Application } from 'express';
import InitApp from '../utils/init/initialize_app';
const app: Application = InitApp.app.expressApp;

const routes: [string, Router][] = [
  ['/auth', require('./api/auth.route')],
  ['', require('./api/group.route')],
  ['/group/text-channel', require('./api/text_channel.route')],
  ['/profile', require('./api/user.route')],
];

routes.forEach((route: [string, Router]) => {
  app.use(`/api${route[0]}`, route[1]);
});
