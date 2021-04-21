const express = require('express');
const app = express();
const server = require('http').createServer(app);

export {
    express,
    app,
    server
};