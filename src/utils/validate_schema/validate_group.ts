import Joi from 'joi';
import { GroupSchema } from '../../models/Group.model';

const groupSchema = Joi.object<GroupSchema>({
    name: Joi.string()
        .trim()
        .min(3)
        .max(40)
        .required(),

    description: Joi.string()
        .trim()
        .min(3),

    image: Joi.string()
        .trim()
});

export default groupSchema;

