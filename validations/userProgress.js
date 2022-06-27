const Joi = require('@hapi/joi');
const JoiObjectId = require('../utils/joi-objectid')(Joi);
 
exports.SAVEDARFT_LOGIN = data => {
  const schema = Joi.object({
    user_id               : JoiObjectId().required(),
    user_type             : Joi.string().required(),
    application_number    : Joi.string().required(),
    last_filled_data      : Joi.object().required().not({}),
    form_name             : Joi.string().required()
  });
  return schema.validate(data);
};

exports.SAVEDARFT_GUEST = data => {
  const schema = Joi.object({
    user_type             : Joi.string().required(),
    user_email            : Joi.string().required().email(),
    application_number    : Joi.string().required(),
    last_filled_data      : Joi.object().required().not({}),
    form_name             : Joi.string().required()
  });
  return schema.validate(data);
};

exports.SAVEUSERPROGRESS_VALIDATION = data => {
  const schema = Joi.object({
    user_id               : JoiObjectId().required(),
    application_number    : Joi.string().required(),
    last_filled_data      : Joi.object().required().not({}),
    form_name             : Joi.string().required()
  });
  return schema.validate(data);
};

exports.PREVIEWUSERPROGRESS_VALIDATION = data => {
  const schema = Joi.object({
    user_id               : JoiObjectId().required(),
    form_name             : Joi.string().required()
  });
  return schema.validate(data);
};

exports.USERPROGRESSREPORT_VALIDATION = data => {
  const schema = Joi.object({
    form_completed        : Joi.boolean().required(),
    form_name             : Joi.string()
  });
  return schema.validate(data);
};

exports.DELETEUSERPROGRESS_VALIDATION = data => {
  const schema = Joi.object({
    id                    : JoiObjectId().required(),
  });
  return schema.validate(data);
};

exports.RETRIEVEUSERPROGRESS_VALIDATION = data => {
  const schema = Joi.object({
    application_number    : Joi.string().required()
  });
  return schema.validate(data);
};