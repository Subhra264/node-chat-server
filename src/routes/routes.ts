import InitApp from '../utils/init/initialize_app';
const app = InitApp.app.expressApp;

app.use('/api/auth', require('./api/auth.route'));
app.use('/api', require('./api/group.route'));