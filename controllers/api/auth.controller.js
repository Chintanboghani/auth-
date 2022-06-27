const bcrypt = require("bcryptjs");
const { ERROR } = require("../../utils/error");
const { REGISTER_VALIDATION, LOGIN_VALIDATION, FORGOT_VALIDATION, RESET_VALIDATION, } = require("../../validations/userValidation");
const db = require('../../models/index');
const nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
const USERMODEL = db.user;
const USERTOKENMODEL = db.userToken;
const OTP = db.otp;

module.exports = {
  login: async (req, res, next) => {       
    try {
      // Validate
      const validate = LOGIN_VALIDATION(req.body);
      const { error } = validate;
      if (error) return res.status(301).send({status:301, message: error.details[0].message });

      const payload = req.body;
      const _query = { isDeleted: { '$ne': true }, email: payload.email };

      let user = await USERMODEL.findOne(_query);
      if (!user) return res.status(301).send({status:301, message: "You don't have account with given info." });

      const validPass = await bcrypt.compare(payload.password, user.password);
      if (!validPass) return res.status(301).send({status:301, message: "Invalid email and password." });

      const accessToken = user.generateJwt();
      user.accessToken = accessToken;
      var userDetails = {
        _id: user._id,
        user_name: user.user_name,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        password: user.password,
        phone: user.phone,
        status: user.status,
        zipcode: user.zipcode,
        state: user.state,
        deviceToken: user.deviceToken,
        userRole : user.userRole
      };
      if (payload.device && payload.device.deviceId && payload.device.deviceId != "") {
        let deviceId = payload.device.deviceId;
        await USERMODEL.updateOne({ _id: user.id }, { deviceToken: payload.deviceToken });
        userDetails.deviceToken = payload.deviceToken;
        await USERTOKENMODEL.updateMany({ userId: user.id, deviceId: deviceId }).set({ isLoggedIn: false });
        const newUserTokenDetails = new USERTOKENMODEL({
          userId: user.id,
          token: user.accessToken,
          deviceId: deviceId,
          isLoggedIn: true
        });
        const logindata = await USERTOKENMODEL.findOneAndUpdate({userId:user.id},{$set:{token:user.accessToken ,isLoggedIn:true ,deviceId}})
        if (!logindata) {
          await newUserTokenDetails.save();
        }

      }
      delete userDetails.password;
      res.status(200).send({status:200, message: "User logged in successfully." ,data: { accessToken, user: userDetails }});
    }

    catch (err) {
      res.status(301).json({status:301, message: ERROR.DefaultPublicError });
    }
  },
  
  register: async (req, res, next) => {
    try {
      // Validate
      const validate = REGISTER_VALIDATION(req.body);
      const { error } = validate;
      if (error) return res.status(301).json({status:301,message:error.details[0].message});
      const payload = req.body;
      //check if email exist
      const emailExist = await USERMODEL.findOne({ email: payload.email });
      if (emailExist) return res.status(301).send({status:302, message: `${payload.email} is already in use.` });
      else {
        //encrypt password before saving into DB

        const salt = await bcrypt.genSalt(8);
        const hashedPassword = await bcrypt.hash(payload.password, salt)

        const newUser = new USERMODEL({
          user_name: payload.user_name,
          first_name: payload.first_name,
          last_name: payload.last_name,
          email: payload.email,
          password: hashedPassword,
          phone: payload.phone,
          street_address1: payload.street_address1,
          street_address2: payload.street_address2,
          city: payload.address,
          zipcode: payload.zipcode,
          country: payload.country,
          state: payload.state,
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

  forgot: async (req, res, next) => {
    const validationError = FORGOT_VALIDATION(req.body);
    const { error } = validationError;
    if (error) return res.status(301).send({status:301, message: error.details[0].message});
    const payload = req.body;
    const data = await USERMODEL.findOne({ email: payload.email });
    if (data) {
      let num = "12345467890";
      let otpcode = "";
      for (let i = 0; i < 4; i++) {
        otpcode += num[Math.floor(Math.random() * 10)]
      }
      const otpData = new OTP({
        email: req.body.email,
        otp: otpcode,
        expireIn: new Date().getTime() + 500 * 1000
      })
      const data = await otpData.save();

      //TestSchema.createIndex({"expire_at": 1 }, { expireAfterSeconds: 5 } );
      const transport = nodemailer.createTransport(smtpTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      }));
      const mailnOptions = {
        from: process.env.EMAIL_USER,
        to: `${req.body.email}`,
        subject: "Bill-Generator ",
        text: `Please use ${data.otp} OTP to update your password.`

      }

      transport.sendMail(mailnOptions, (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Mail is successfully send");
        }
      });

      res.status(200).json({status:200, message: `OTP is send to your register ${payload.email} email.` });
    } else {
      res.status(302).json({status:301, message: "No email id found." });
    }

  },

  reset: async (req, res, next) => {
    try {
      // Validate
      const validationError = RESET_VALIDATION(req.body);
      const { error } = validationError;
      if (error) return res.status(301).send({status:301, message: error.details[0].message });

      const payload = req.body;
      const data = await OTP.findOne({ otp: payload.otp, used_otp: false });

      const currentTime = new Date().getTime();
      if (data) {
        const New_password = payload.new_password;
        const confirm_password = payload.confirm_password;
        const diff = data.expireIn - currentTime;

        if (diff < 0) {
          res.status(301).json({status:301,message:'This OTP is expire. Please try again with new one.'});
        }
        if (payload.otp === data.otp) {
          if (New_password === confirm_password) {
            
            //encrypt password before saving into DB
            const salt = await bcrypt.genSalt(8);
            const hashedPassword = await bcrypt.hash(payload.new_password, salt);
            if( await USERMODEL.findOneAndUpdate({ email: data.email }, { password: hashedPassword }, { new: true })){
              await OTP.findOneAndUpdate({ otp: payload.otp },{$set:{ used_otp: true }}, { new: true });
              res.status(201).json({status:200,message:"Successfully password update."});
            }
          } else {
            res.status(301).json({status:301,message: "Confirm password is invalid." });
          }
        }
      } else {
        res.status(301).json({status:301,message:"Invalid OTP"});
      }
    }
    
    catch (error) {
       res.status(301).json({status:301,message:"Somthing went worng"});
    }
  
  },

  logout: async  (req, res)=> {
    const user_id = req.params.id;
     const deviceId = req.headers['deviceid'];

     let user = await USERMODEL.findOne({_id : user_id});
     if (!user) return res.status(301).send({status:301, message: "You don't have account with given info." });

     if(deviceId){
        await USERTOKENMODEL.findOneAndUpdate({userId: user_id, deviceId: deviceId},{$set:{token: "", isLoggedIn:false}})
     }
     res.send({msstatus:200, message: 'You have been Logged Out' });
  }
};