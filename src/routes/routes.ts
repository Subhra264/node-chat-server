import { Router, Application } from 'express';
import InitApp from '../utils/init/initialize_app';
const app: Application = InitApp.app.expressApp;

const routes: [string, Router][] = [
    ['/api/auth', require('./api/auth.route')],
    ['/api', require('./api/group.route')],
    ['/api/group', require('./api/text_channel.route')]
];

routes.forEach((route: [string, Router]) => {
    app.use(route[0], route[1]);
});