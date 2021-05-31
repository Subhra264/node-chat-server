import Joi from 'joi';
import { TextChannelSchema } from '../../models/channels/TextChannel.model';

const TextChannel_Joi = Joi.object<TextChannelSchema>({
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

export default TextChannel_Joi;