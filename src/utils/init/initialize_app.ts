import express, { Application } from 'express';
const app: Application = express();
const server = require('http').createServer(app);

// TODO: process.on('beforeExit', callback_to_remove_JWT_ACCESS_KET_and_JWT_REFRESH_KEY_from_env)

export {
    app,
    server
};