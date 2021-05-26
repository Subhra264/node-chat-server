const Joi = require('joi');

const userSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(3)
        .max(40),

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
        .pattern(/^[a-zA-Z0-9!@#$%^&*]{6,20}$/)
        .required(),

    profilePic: Joi.string(),

    about: Joi.string(),

});

export = userSchema;