import express, { Application } from 'express';
const app: Application = express();
const server = require('http').createServer(app);

export {
    app,
    server
};