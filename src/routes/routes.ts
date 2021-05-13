const { app } = require('../utils/init/initialize_app');

app.use('/api/auth', require('./api/auth.route'));