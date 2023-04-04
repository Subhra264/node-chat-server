import Joi from 'joi';

export interface GroupSchema {
  name: string;
  description?: string;
  image?: string;
}

const groupSchema = Joi.object<GroupSchema>({
  name: Joi.string().trim().min(3).max(40).required(),

  description: Joi.string().trim().min(2),

  image: Joi.string().trim(),
});

export default groupSchema;
