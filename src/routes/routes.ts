import { Router } from 'express';
import InitApp from '../utils/init/initialize_app';
const app = InitApp.app.expressApp;

const routes: [string, Router][] = [
    ['/api/auth', require('./api/auth.route')],
    ['/api', require('./api/group.route')],
    ['/api', require('./api/text_channel.route')]
];

routes.forEach((route) => {
    app.use(route[0], route[1]);
});