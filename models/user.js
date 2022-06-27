const mongoose = require("mongoose");
const { USERROLE,ACTIVESTATUS } = require('../utils/constants');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  user_name     : { type: String, max: 255 },
  first_name    : { type: String, max: 255 },
  last_name     : { type: String, max: 255 },
  email         : { type: String, required: true, max: 255 },
  password      : { type: String, required: true, max: 1024 },
  confirm_password: { type: String,max: 1024 },
  phone         : { type: String, default: "" },
  date          : { type: Date, default: Date.now() },
  userRole      : { type: String, enum: [...Object.values(USERROLE)], default: USERROLE.CUSTOMER },
  status        : { type: String, enum: [...Object.values(ACTIVESTATUS)], default: ACTIVESTATUS.ACTIVE },
  street_address1:{ type: String, default: ""},
  street_address2:{ type: String, default: ""},
  city          : { type: String, default: "" },
  zipcode       : { type: String, default: "" },
  country       : { type: String, default: "" },
  state         : { type: String, default: "" },
},
{
  timestamps: true,
});


userSchema.methods.generateJwt = function () {
  return jwt.sign({ _id: this._id }, process.env.TOKEN_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};
module.exports = mongoose.model('user', userSchema, 'users');