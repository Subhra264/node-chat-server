const {app, server, express} = require('./utils/init/initialize_app');
const HttpErrors = require('./errors/http-errors');

import HttpError from './errors/HttpError';

const PORT = process.env.PORT || 8000;

require('./config/env_setup');

// Initialize MongoDB
require('./utils/init/initialize_db');

app.use(async (req, res, next) => {
    const error = await HttpErrors.NotFound();
    next(error);
});

app.use(async (err: HttpError, req, res, next) => {
    res.status(err.status).json({
        status: err.status,
        message: err.message
    });
});

server.listen(PORT, () => {
    console.log('Server running at', PORT);
});