const Joi = require('@hapi/joi');
const JoiObjectId = require('../utils/joi-objectid')(Joi);
exports.coupon_validation = data => {
    const schema = Joi.object({
      code                  : Joi.string().required(),
      start_date            : Joi.date().required(),
      end_date              : Joi.date().min(Joi.ref('start_date')).required(),
      total_coupon          : Joi.number().required(),
      discount              : Joi.number().min(0).max(100).required(),
      used_coupon           : Joi.number(),
      remaining_coupon      : Joi.number(),
    });
  
    return schema.validate(data);
  };
  