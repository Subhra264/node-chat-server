import Joi from 'joi';

const MessageReqSchema_Joi = Joi.object({
  message: Joi.string().trim().required(),

  channelId: Joi.string().hex().length(24).required(),

  groupId: Joi.string().hex().length(24).required(),
});

export default MessageReqSchema_Joi;
