const { app } = require('../utils/init/initialize_app');

app.use('/api', require('./api/auth.route'));