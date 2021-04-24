const Joi = require('joi');

const userSchema = Joi.object({
    name: Joi.string()
        .required(),

    userName: Joi.string()
        .trim()
        .lowercase()
        .alphanum()
        .min(3)
        .max(12)
        .required(),

    email: Joi.string()
        .trim()
        .email()
        .lowercase()
        .required(),

    password: Joi.string()
        .pattern(/^[a-zA-Z0-9!@#\$%\^\&*]{3,30}$/)
        .required(),

    image: Joi.string(),

    about: Joi.string(),

});

export = userSchema;