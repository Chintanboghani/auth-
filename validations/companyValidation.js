var Joi = require("@hapi/joi");

exports.COMPANYREGISTER_VALIDATION = data => {
  const schema = Joi.object({
    name          : Joi.string().required(),
    website       : Joi.string().required(),
    email         : Joi.string().pattern(new RegExp('^(?!.+@(gmail|google|yahoo|outlook|hotmail|msn)\..+)(.+@.+\..+)$'))
                    .required().messages({"string.pattern.base": "Please enter your business email address"}),
    phone         : Joi.string().required(),
    address       : Joi.string().required(),
    zipcode       : Joi.string().required(),
    userId        : Joi.string().required(),
    status        : Joi.string().required()
    
  });
  return schema.validate(data);
};

exports.REGISTERFILE_VALIDATION = data => {
  const schema = Joi.object({
    industries    : Joi.array().required(),
    w9form        : Joi.array().required(),
    insurancedocs : Joi.array().required(),
  });
  return schema.validate(data);
};