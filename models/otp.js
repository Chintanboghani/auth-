const mongoose = require("mongoose");
const otpSchema = new mongoose.Schema({
  email         : { type:String},
  otp          : { type:String},
  expireIn      : { type:Number},
  used_otp      :  { type:Boolean,default: false,required: true}
},{
    timestamps: true,
  });

module.exports = mongoose.model('otp',otpSchema,'otp');