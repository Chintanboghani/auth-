
const db = require("../../models/index");

const { ERROR } = require("../../utils/error");
const { DEFAULTDATA, PAYMENT_STATUS } = require("../../utils/constants");

const USERMODEL = db.user;
const USERPROGRESSMODEL = db.userprogress;
const ORDERSUMMARYMODEL = db.ordersummary;
const COUPON = db.coupon;
const nodemailer = require('nodemailer');
const fetch = require("node-fetch");
const pdf = require("html-pdf");
let options = { 
  format: 'A4',
  orientation: 'portrait'
};

module.exports = {
   getAllUser : async (req,res,next)=>{
    try {
      let users = await USERMODEL.find({isDeleted:false});
      console.log('\x1b[32m%s\x1b[0m','\n###### -- Logic Execute --######');
      res.status(200).send({ status: 200, message:"List of all users", data :{ user: users ,count: users.length },error:null});
    } catch (err) {
      console.log(err);
      res.status(302).json({ message: ERROR.DefaultPublicError, error:err });
    }
  },

  getLoggedInUser : async (req,res,next)=>{
    try {
        const userId = req.jwtUserId;
        const user = await USERMODEL.findOne({ _id: userId});
        if (!user) return res.status(401).send({status: 401, message: "Invalid authorization token" });
        res.status(200).send({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                password: user.password,
                phone: user.phone,
                status: user.status,
                country: DEFAULTDATA.COUNTRY,
                isPublic: true,
                zipcode: user.zipcode,
                userRole: user.userRole,
                state: user.state
          }, message: "Loggedin user details", error: null
        });
    } catch (err) {
      console.log("CATCH ERROR ::");
      console.log(err);
      res.status(302).json({ message: ERROR.DefaultPublicError, error:err });
    }
  },

  updateUserDetails: async(req,res,next)=>{
    try {
      const id = req.params.id;
      const payload = req.body;
      let user = await USERMODEL.findOneAndUpdate({ _id: id, isDeleted: { '$ne': true }},{ $set: payload });
      res.status(200).json({status: 200, message: "User profile updated successfully",data: user,  error: null });
    } catch (err) {
      console.log("CATCH ERROR ::");
      console.log(err);
      res.status(302).json({ message: ERROR.DefaultPublicError, error:err });
    }
  },

  getAllUserByRole: async (req,res,next)=>{
    try {
      const role = req.params.userRole;
      let users = await USERMODEL.find({ userRole: role, isDeleted:false});
      res.status(200).send({status: 200, message: "List of users by role",  data: { user: users, count: users.length }, error: null });
    } catch (err) {
      console.log("CATCH ERROR ::");
      console.log(err);
      res.status(302).json({ message: ERROR.DefaultPublicError, error:err });
    }
  },

  generatePdf: async (req,res,next)=>{
    try {
      const payload = req.body;
      const orderId = payload.order_id;
      const coupon = payload.coupon;

      const orderData = await ORDERSUMMARYMODEL.findOne({ _id: orderId }).lean();
      const success_payment = await ORDERSUMMARYMODEL.findOne({ _id: orderId,$or : [{ payment_status: PAYMENT_STATUS.SUCCESS}, { payment_status: PAYMENT_STATUS.FREE} ]} );
      if(!success_payment){
        if(coupon){
          const couponData = await COUPON.findOne({ code: coupon});
          const updated_data = await COUPON.findOneAndUpdate({code:coupon},{$inc: { used_coupon: 1 }},{new: true });
          const remaining_coupon = couponData.Total_coupon - updated_data.used_coupon;
          
          await COUPON.findOneAndUpdate({code:coupon},{remaining_coupon:remaining_coupon },{new: true });
        
          var discount = (orderData.payment_amount * couponData.Discounts_Percentage) / 100; 
          var amount = (orderData.payment_amount - discount).toFixed(2);
          if(amount == 0.00 || amount == 0){
              var status = PAYMENT_STATUS.FREE
          }else{
              var status = PAYMENT_STATUS.SUCCESS
          }
          await ORDERSUMMARYMODEL.findOneAndUpdate({ _id: orderId},{ used_coupon : true, payment_amount: amount, payment_status: status, apply_coupon_code: coupon},{new: true });
        }else{
          await ORDERSUMMARYMODEL.findOneAndUpdate({ _id: orderId }, { $set: { payment_status: PAYMENT_STATUS.SUCCESS } },{new: true });
        }
      }

      const updateOrderData = await ORDERSUMMARYMODEL.findOne({ _id: orderId }).lean();

      await USERPROGRESSMODEL.findOneAndUpdate({ _id: orderData.progress_id }, { $set: { form_completed: true } });

      const progressData = await USERPROGRESSMODEL.findOne({ _id: orderData.progress_id }).lean();

      const user_data = await USERMODEL.findOne({ _id: orderData.user_id },'email');
      var result = progressData.last_filled_data;
      var application_number = progressData.application_number;
      var user_id = orderData.user_id;
      var data = {
        application_number:application_number,
        user_id:user_id
      };
      
      var body = {
        "application_number": application_number
    }; 

      fetch(process.env.HOST_URL+'/api/v2/userProgress/retrieveUserProgess', {
        method: 'post',
        body: JSON.stringify(body),
        headers: {'Content-Type': 'application/json'}
    }).then(res => res.json()).then(function(response) {
        var result = response.data.last_filled_data;
        var data = response.data;
        var application_number = data.application_number;
        var user_id = data.user_id;
        res.render("html2pdf/index",{result, data, },function(err,html){
          pdf.create(html, options).toFile('./public/upload/pdf/'+application_number+'_Pdf.pdf', async function(err, result) {
                if (err){
                  return res.status(301).send({ status: 301, message: err });
                }else{
                  await USERPROGRESSMODEL.findOneAndUpdate({ _id: orderData.progress_id }, { $set: { pdf_path: '/public/upload/pdf/'+application_number+'_Pdf.pdf' } });
                } 
            });
        }); 
    });

      // res.render("html2pdf/index",{result, data, },function(err,html){
      //     pdf.create(html, options).toFile('./public/upload/pdf/'+application_number+'_'+user_id+'_Pdf.pdf', async function(err, result) {
      //         if (err){
      //           return res.status(301).send({ status: 301, message: err });
      //         }else{
      //           await USERPROGRESSMODEL.findOneAndUpdate({ _id: orderData.progress_id }, { $set: { pdf_path: '/public/upload/pdf/'+application_number+'_'+user_id+'_Pdf.pdf' } });
      //         } 
      //     });
      // }); 

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
         to: user_data.email,
         subject: "Bill-Generator ",
         text: `payment receipt`,
         attachments: [
           {
             filename: updateOrderData.bill_type+'.pdf',
             path: "./public/upload/pdf/" + application_number + "_Pdf.pdf"
           }
         ]
       }

       transport.sendMail(mailnOptions, (err, res) => {
          if (err) {
            async function failed() {
              await USERPROGRESSMODEL.findOneAndUpdate({ _id: orderData.progress_id }, { $set: { pdf_response: "Failed" } });
            }
            failed();
          } else {
            const success = async function() {
              await USERPROGRESSMODEL.findOneAndUpdate({ _id: orderData.progress_id }, { $set: { pdf_response: "Generated" } });
              console.log(res);
            }
            success();
          }
       });
       
      return res.status(200).send({ status: 200, message: "success", data:{orderData:updateOrderData,progressData:progressData,user_data:user_data} });
    } catch (err) {
      console.log("CATCH ERROR ::");
      console.log(err);
      res.status(302).json({ message: ERROR.DefaultPublicError, error:err });
    }
  }
};