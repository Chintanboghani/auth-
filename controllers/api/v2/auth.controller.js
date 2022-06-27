const bcrypt = require("bcryptjs");
const { ERROR } = require("../../../utils/error");
const { REGISTER_VALIDATION_V2 } = require("../../../validations/userValidation");
const db = require('../../../models/index');
const USERMODEL = db.user;

module.exports = {
  
  register: async (req, res, next) => {
    try {
      // Validate
      const validate = REGISTER_VALIDATION_V2(req.body);
      const { error } = validate;
      if (error) return res.status(301).json({status:301,message:error.details[0].message});
      const payload = req.body;

      const userNameExist = await USERMODEL.findOne({ user_name: payload.user_name });
      if (userNameExist) return res.status(301).send({status:302, message: `${payload.user_name} is already in exist.` });

      const emailExist = await USERMODEL.findOne({ email: payload.email });
      if (emailExist) return res.status(301).send({status:302, message: `${payload.email} is already in use.` });
      
      else {
        const salt = await bcrypt.genSalt(8);
        const hashedPassword = await bcrypt.hash(payload.password, salt)

        const newUser = new USERMODEL({
          user_name: payload.user_name,
          email: payload.email,
          password: hashedPassword,
        });

        if (payload.password !== payload.confirm_password) {
          res.status(302).send({status:302, message: "Confirm password is invalid." });
        } else {
          const savedUser = await newUser.save();
          console.log('\x1b[32m%s\x1b[0m', '\n###### -- Register Execute --######');
          res.status(200).json({status:200, message: "Register successfully", data: savedUser });
        }
      }
    }
    catch (err) {
      //console.log(err);
      res.status(302).json({status:302, message: "Invalid Details" });
    }
  },

};