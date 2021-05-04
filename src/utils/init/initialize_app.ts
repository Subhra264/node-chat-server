import express, { Application } from 'express';
const app: Application = express();
import http, { Server } from 'http';
const server: Server = http.createServer(app);

export {
    app,
    server
};