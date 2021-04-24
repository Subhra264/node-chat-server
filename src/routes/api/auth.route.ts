const { createAccount } = require('../../controllers/auth.controller');

const express = require('express');
const Router = express.Router();

Router.post('/signup', async (req, res, next) => {

    try {

        await createAccount(req, res, next);

        res.json({
            type: 'success',
            message: "Yep! running..."
        });
    } catch(err) {
        next(err);
    }

});

Router.post('/signin', async (req, res, next) => {
    res.json({
        type: 'success',
        message: "Signed in!"
    });
});

export = Router;