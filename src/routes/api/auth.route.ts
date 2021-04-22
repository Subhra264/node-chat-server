const express = require('express');
const Router = express.Router();

Router.get('/signup', async (req, res) => {
    res.json({
        message: "Yep! running..."
    });
});

Router.get('/signin', async (req, res) => {
    res.json({
        message: "Signed in!"
    });
});

export = Router;