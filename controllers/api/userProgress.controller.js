const { SAVEUSERPROGRESS_VALIDATION, PREVIEWUSERPROGRESS_VALIDATION, USERPROGRESSREPORT_VALIDATION, DELETEUSERPROGRESS_VALIDATION, RETRIEVEUSERPROGRESS_VALIDATION } = require('../../validations/userProgress');
const { ERROR } = require("../../utils/error");
const db = require('../../models/index');
var crypto = require("crypto");
const { listeners } = require('process');
const { Console } = require('console');
const USERMODEL = db.user;
const USERPROGRESSMODEL = db.userprogress;

module.exports = {
  saveUserProgess: async (req, res, next) => {   
    try {
      const payload = req.body;
      const validate = SAVEUSERPROGRESS_VALIDATION(req.body);   
      
      const { error } = validate;
      if (error) return res.status(301).send({status:301, message: error.details[0].message});
  
      let user = await USERMODEL.findOne({_id: payload.user_id});
      if (!user)  return res.send({status:422, message: "You don't have account with given info." });
    
      let previewData = await USERPROGRESSMODEL.findOne({user_id: payload.user_id, application_number: payload.application_number});
      
      if(previewData){
        const updateData = await USERPROGRESSMODEL.findOneAndUpdate({ _id: previewData.id},{ $set: {last_filled_data : payload.last_filled_data}},{ new: true });
     
        return res.status(200).json({status:200, message: "Preview data updated successfully.", data: updateData });
      }else{
        const craeteUserProgess = new USERPROGRESSMODEL({
          user_id: payload.user_id,
          application_number: payload.application_number,
          last_filled_data: payload.last_filled_data,
          form_name: payload.form_name,
        });
        const userProgress = await craeteUserProgess.save();
        
        return res.status(200).json({status:200, message: "User progress data save successfully.", data: userProgress });
      }
    }
    catch (err) { next(err); }
  },

  previewUserProgess: async (req, res, next) => {   
    try {
      const validate = PREVIEWUSERPROGRESS_VALIDATION(req.body);      
      const { error } = validate;
      if (error) return res.status(301).send({status:301,  message: error.details[0].message });
  
      const payload = req.body;
      let userProgress = await USERPROGRESSMODEL.find({user_id: payload.user_id, form_name: payload.form_name, form_completed: false}).select('application_number -_id');
      if (!userProgress)  return res.send({status:422, message: "You don't have preview data with given info." });

      return res.send({status:200, message:"User preview data.", data: userProgress});
    }
    catch (err) { next(err); }
  },

  userProgessReport: async (req, res, next) => {   
    try {
      const validate = USERPROGRESSREPORT_VALIDATION(req.body);      
      const { error } = validate;
      if (error) return res.status(301).send({status:301, message: error.details[0].message});
      const payload = req.body;
      if(payload.form_name){       
        const userProgressReport = await USERPROGRESSMODEL.find({form_name: payload.form_name, form_completed:payload.form_completed}).sort({_id:-1});
        return res.send({status:200, message: `User Progress details ${payload.form_name}`, data: userProgressReport});
      }else{
        let userProgressReport = await USERPROGRESSMODEL.find({form_completed:payload.form_completed}).sort({_id:-1});
        return res.send({status:200, message:"User Progress deatils.", data: userProgressReport});
      }
    }
    catch (err) { next(err); }
  },

  deleteUserProgess: async (req, res, next) => {   
    try {
      const validate = DELETEUSERPROGRESS_VALIDATION(req.body);      
      const { error } = validate;
      if (error) return res.status(301).send({status:301, message: error.details[0].message });

      const payload = req.body;
      let data = await USERPROGRESSMODEL.findOne({_id: payload.id});
      if (!data)  return res.send({status:422, message: "No information found for a given id." });

      await USERPROGRESSMODEL.deleteOne({_id: payload.id});
      return res.send({status:200, message:"User Progress deatils delete successfully."});

    }
    catch (err) { next(err); }
  },

  retrieveUserProgess: async (req, res, next) => {   
    try {
      const validate = RETRIEVEUSERPROGRESS_VALIDATION(req.body);      
      const { error } = validate;
      if (error) return res.status(301).send({ message: error.details[0].message, error: error });

      const payload = req.body;
      let data = await USERPROGRESSMODEL.findOne({user_id: payload.user_id});
      if (!data)  return res.send({status:422, message: "You don't have account with given info." });
     
      let userProgress = await USERPROGRESSMODEL.findOne({user_id: payload.user_id, application_number:payload.application_number});  
      if(userProgress){
        return res.send({status:200, message:"Data retrieve successfully.", data: userProgress});
      }else{
        return res.send({status:422, message:"Data is not found"});

      }
      // var due_payment_amt = userProgressData.last_filled_data.due_payment_amt;
      // var previous_payment = Number(userProgressData.last_filled_data.previous_payment).toFixed(2);
      // var due_payment_amount = Number(due_payment_amt).toFixed(2);
      // if(!due_payment_amt){
      //   var delivery_charges = "55.66";
      //   var generation_charges = "32.48";
      // }else{
      //   var delivery_charges = (due_payment_amt * (63.15 / 100)).toFixed(2);
      //   var generation_charges = (due_payment_amt * (36.85 / 100)).toFixed(2);
      // }
     
      // var get_statement_date = userProgressData.last_filled_data.statement_date;

      // if(get_statement_date){
      //   let statement_date = new Date(get_statement_date);
      //   statement_date.setDate(statement_date.getDate() + 10);
      //   var dd = statement_date.getDate();
      //   var mm = ("0" + (statement_date.getMonth() + 1)).slice(-2);
      //   var yyyy = statement_date.getFullYear();
      //   var due_date = dd + '/' + mm + '/' + yyyy;  
      // }else{
      //   var due_date = "dd/mm/yyyy"; 
      // }
      
      // const userProgress = await USERPROGRESSMODEL.aggregate([
      //    { $match: { _id: userProgressData._id } },
      //    { $addFields : { last_filled_data: {  "delivery_charges": delivery_charges, "generation_charges": generation_charges, "due_date" : due_date, "due_payment_amt":due_payment_amount, "previous_payment":previous_payment }}} 
      // ],{ new: true });

    }
    catch (err) { next(err); }
  },

};
