import express, { Request, Response, NextFunction } from 'express';
import InitApp from './utils/init/initialize_app';
const app = InitApp.app.expressApp;
const server = InitApp.app.server;

const HttpErrors = require('./errors/http-errors');

import HttpError from './errors/HttpError';

// Initialize Redis and MongoDB database
require('./utils/init/initialize_db');
require('./utils/init/initialize_redis').init();

const PORT = process.env.PORT || 8000;

app.use(express.json());

// Require the routes
require('./routes/routes');

// Handle NotFound error
app.use(async (req: Request, res: Response, next: NextFunction) => {
    const error = HttpErrors.NotFound();
    next(error);
});

// Handle all the HttpErrors
app.use(async (err: HttpError, req: Request, res: Response, next: NextFunction) => {
    console.log('Error in server', err);
    
    return res.status(err.status).json({
        type: 'error',
        message: {
            status: err.status,
            message: err.message
        }
    });
});

server.listen(PORT, () => {
    console.log('Server running at', PORT);
});