const { USERROLE } = require("../../utils/constants");
const bcrypt = require("bcryptjs");
const db = require('../../models/index');
const USERMODEL = db.user;

// Admin login

exports.adminlogin = async(req,res,next)=>{
 // try {
  const payload = req.body;
  const admin_data = await USERMODEL.findOne({email : payload.email});
  
  if(admin_data){
    const validPass =  await bcrypt.compare(payload.password, admin_data.password);

    if(validPass) {
      if(admin_data.userRole = USERROLE.ADMIN){
        session_data = req.session;
        session_data.user_name = admin_data.user_name
        session_data.email = admin_data.email
        session_data.password = admin_data.password
        res.redirect('../../admin/dashboard');
      }else{

        res.redirect('../../admin/login');
      }
    }else{
      res.redirect('../../admin/login');
    }
  }else{
    res.redirect('../../admin/login');
  }
    
}