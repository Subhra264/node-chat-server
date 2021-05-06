import express, { Application } from 'express';
const app: Application = express();
import http, { Server } from 'http';
const server: Server = http.createServer(app);
import { Server as Socket} from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
const io: Socket<DefaultEventsMap, DefaultEventsMap> = new Socket(server, {
    transports: ['websocket']
});

export {
    app,
    server,
    io
};