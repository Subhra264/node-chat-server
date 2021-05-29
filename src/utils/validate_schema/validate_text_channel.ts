import Joi from 'joi';

const TextChannelSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(3)
        .max(40)
        .required(),

    parentGroup: Joi.string()
        .hex()
        .length(24)
        .required()
});

export default TextChannelSchema;