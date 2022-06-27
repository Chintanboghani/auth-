var Joi = require("@hapi/joi");

//VALIDATE USER Register INFO
exports.REGISTER_VALIDATION = data => {
  const schema = Joi.object({
    user_name   : Joi.string().required(),
    first_name  : Joi.string().required(),
    last_name  : Joi.string().required(),
    email       : Joi.string().required().email(),
    password    : Joi.string().required().min(6),
    confirm_password: Joi.string().required().min(6),
    phone       : Joi.string().required(),
    userRole    : Joi.string(),
    street_address1:Joi.string().required(),
    street_address2:Joi.string().allow(null, ''),
    city        : Joi.string().required(),
    zipcode     : Joi.string().required().min(5).max(5),
    country     : Joi.string().required(),
    state       : Joi.string().required(),
    device      : Joi.object(),
    deviceToken : Joi.string().allow(null, ''),
  });

  return schema.validate(data);
};

//Validate Login User
exports.LOGIN_VALIDATION = data => {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().min(6).required(),
    device: Joi.object(),
    deviceToken: Joi.string().allow(null, ''),
    loginType: Joi.string().allow(null, ''),
  });

  return schema.validate(data);
};

//Validate forgot User
exports.FORGOT_VALIDATION = data => {
  const schema = Joi.object({
    email : Joi.string().required().email(),
  });

  return schema.validate(data);
};

//Validate reset User
exports.RESET_VALIDATION = data => {
  const schema = Joi.object({
    otp :Joi.string().required(),
    new_password :Joi.string().required().min(6), 
    confirm_password : Joi.string().required().min(6),
  });

  return schema.validate(data);
};

exports.ADMINLOGIN = data => {
  const schema = Joi.object({
    email     : Joi.string().email().optional().trim().lowercase().default(null),
    password  : Joi.string().required().max(128).trim(),
  });

  return schema.validate(data);
};

//VALIDATE USER Register V2
exports.REGISTER_VALIDATION_V2 = data => {
  const schema = Joi.object({
    user_name         : Joi.string().required(),
    email             : Joi.string().required().email(),
    password          : Joi.string().required().min(6),
    confirm_password  : Joi.string().required().min(6),
    userRole          : Joi.string(),
    device            : Joi.object(),
    deviceToken       : Joi.string().allow(null, ''),
  });

  return schema.validate(data);
};
