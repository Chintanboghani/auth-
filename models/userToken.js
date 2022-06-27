const mongoose = require("mongoose");

const userTokenSchema = new mongoose.Schema({
  deviceId   : { type: String },
  token      : { type: String },
  userId     : { type: String },
  isLoggedIn : { type: Boolean, default: true }
},
{
  timestamps: true,
}
);

module.exports = mongoose.model('userToken', userTokenSchema, 'userTokens');