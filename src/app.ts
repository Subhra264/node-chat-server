import express, { Request, Response, NextFunction } from 'express';
const { app, server } = require('./utils/init/initialize_app');
const HttpErrors = require('./errors/http-errors');

import HttpError from './errors/HttpError';

const PORT = process.env.PORT || 8000;

app.use(express.json());

// Require the routes
require('./routes/routes');

app.use(async (req: Request, res: Response, next: NextFunction) => {
    const error = await HttpErrors.NotFound();
    next(error);
});

app.use(async (err: HttpError, req: Request, res: Response, next: NextFunction) => {
    return res.status(err.status).json({
        type: 'error',
        error: {
            status: err.status,
            message: err.message
        }
    });
});

server.listen(PORT, () => {
    console.log('Server running at', PORT);
});