import Joi from 'joi';

const groupSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(3)
        .max(40)
        .required(),

    description: Joi.string()
        .trim()
        .min(10),

    image: Joi.string()
        .trim()
});

export default groupSchema;

