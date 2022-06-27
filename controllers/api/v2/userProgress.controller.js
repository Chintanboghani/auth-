const { SAVEDARFT_LOGIN, SAVEDARFT_GUEST, PREVIEWUSERPROGRESS_VALIDATION, USERPROGRESSREPORT_VALIDATION, DELETEUSERPROGRESS_VALIDATION, RETRIEVEUSERPROGRESS_VALIDATION } = require('../../../validations/userProgress');
const { ERROR } = require("../../../utils/error");
const { USERTYPE } = require("../../../utils/constants");
const db = require('../../../models/index');
var crypto = require("crypto");
const { listeners } = require('process');
const { Console, log } = require('console');
const USERMODEL = db.user;
const USERPROGRESSMODEL = db.userprogress;
const nodemailer = require('nodemailer');
const moment = require('moment')

module.exports = {
  saveUserProgess: async (req, res, next) => {   
    try {
      const payload = req.body;
      let user_email;
      let user_id;

      if(payload.user_type === USERTYPE.GUEST_USER){
        const validate = SAVEDARFT_GUEST(req.body);  
        const { error } = validate;
        if (error) return res.status(301).send({status:301, message: error.details[0].message});

        user_email = payload.user_email;
        user_id = null;
      }else{
        const validate = SAVEDARFT_LOGIN(req.body);   
        const { error } = validate;
        if (error) return res.status(301).send({status:301, message: error.details[0].message});

        let user = await USERMODEL.findOne({_id: payload.user_id});
        if (!user)  return res.send({status:422, message: "You don't have account with given info." });

        user_email = user.email;
        user_id = payload.user_id;
      }
  
      let previewData = await USERPROGRESSMODEL.findOne({user_id: payload.user_id, user_email: user_email, application_number: payload.application_number});
     
      if(previewData){
        const updateData = await USERPROGRESSMODEL.findOneAndUpdate({ _id: previewData.id},{ $set: {user_email: user_email, last_filled_data : payload.last_filled_data}},{ new: true });
     
        return res.status(200).json({status:200, message: "Draft data updated.", data: updateData });
      }else{
        const craeteUserProgess = new USERPROGRESSMODEL({
          user_id: user_id,
          user_email : user_email,
          application_number: payload.application_number,
          last_filled_data: payload.last_filled_data,
          form_name: payload.form_name,
        });
        const userProgress = await craeteUserProgess.save();
        const bill_name = userProgress.form_name.charAt(0).toLowerCase() + userProgress.form_name.substring(1).split(' ').join('');
        const transport = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          requireTLS: true,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
          }
        });

        const mailnOptions = {
          from: process.env.EMAIL_USER,
          to: user_email,
          subject: "Bill-Generator ",
          text: `Use ${process.env.FRONTEND_URL}/${bill_name}?account_number=${userProgress.application_number} to open your draft template.`
        }

        transport.sendMail(mailnOptions, (err, res) => {
          if (err) {
            console.log("Email not sent.");
          } else {
            console.log("Email successfully sent.");
          }
       });

        return res.status(200).json({status:200, message: "Data save in draft.", data: userProgress });
      }
    }
    catch (err) { next(err); }
  },

  retrieveUserProgess: async (req, res, next) => {   
    try {
      const validate = RETRIEVEUSERPROGRESS_VALIDATION(req.body);      
      const { error } = validate;
      if (error) return res.status(301).send({ message: error.details[0].message, error: error });

      const payload = req.body;
      // let data = await USERPROGRESSMODEL.findOne({user_id: payload.user_id});
      // if (!data)  return res.send({status:422, message: "You don't have account with given info." });
     
      let userProgress = await USERPROGRESSMODEL.findOne({application_number:payload.application_number});  
      if(userProgress){
        if(userProgress.form_completed === true){
          return res.send({status:301, message:"Your draft as already checkout. Please create new darft."});
        }

        var due_payment_amt = userProgress.last_filled_data.due_payment_amt;

        if(!due_payment_amt){
          var delivery_charges = "55.66";
          var generation_charges = "32.48";
        }else{
          var delivery_charges = (due_payment_amt * (63.15 / 100)).toFixed(2);
          var generation_charges = (due_payment_amt * (36.85 / 100)).toFixed(2);
        }
      
        var statement_date = userProgress.last_filled_data.statement_date;
        if(statement_date){
          var due_date = moment(statement_date, "DD/MM/YYYY").add(10,'d').format("DD/MM/YYYY");
        }else{
          var due_date = "dd/mm/yyyy"; 
        }

        var userProgressData = await USERPROGRESSMODEL.findOneAndUpdate({ _id: userProgress._id},{$set:{"last_filled_data.delivery_charges" : delivery_charges, "last_filled_data.generation_charges" : generation_charges, "last_filled_data.due_date" : due_date}},{new:true})
   
        return res.send({status:200, message:"Retrieve draft data.", data: userProgressData});
      }else{
        return res.send({status:422, message:"Draft data not exist."});

      }

    }
    catch (err) { next(err); }
  },

};
