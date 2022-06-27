const Joi = require('@hapi/joi');
const JoiObjectId = require('../utils/joi-objectid')(Joi);

exports.ORDER_SUMMARY = data => {
    const schema = Joi.object({
      // user_id                : JoiObjectId().required().allow(null, ''),
      user_id                : JoiObjectId().allow(null, ''),
      progress_id            : JoiObjectId().required().allow(null, ''),
      user_type              : Joi.string().required(),
      bill_type              : Joi.string().required(), 
      apply_coupon           : Joi.string(), 
    });
    return schema.validate(data);
  };

  exports.TRANSICTION_HISTORY_VALIDATION = data => {
    const schema = Joi.object({
    coinbase_id              : Joi.string().required(),
    getway                   : Joi.string().required(),
    coinbase_data            : Joi.object().required(),
    });
    return schema.validate(data);
  };

  exports.TRANSICTION = data => {
    const schema = Joi.object({
      progress_id            : JoiObjectId().required(),
      order_id               : JoiObjectId().required(),
      amount                 : Joi.number().required(),
    });
    return schema.validate(data);
  };