const db = require("../../models/index");
const moment = require('moment')
const COUPON = db.coupon;

module.exports = {
    verifyCoupon : async (req, res) => {
        const payload = req.body;
        const Coupon = await COUPON.findOne({ code: payload.coupon})
        if(payload.coupon === ''){           
            return res.status(301).json({status : 301 ,  message: 'Please enter the coupon.'})
        }
        if (Coupon) {
            const currentDate = moment(new Date()).format("MM-DD-YYYY");
            if ( Coupon.status === true && Coupon.Total_coupon>Coupon.used_coupon && currentDate >= Coupon.start_date && currentDate <= Coupon.End_date) {
                res.status(200).json({status : 200 ,  message: 'Coupon Applied.', data: Coupon})
            } else {
                return res.status(301).json({status : 301 ,  message: 'Coupon expired! Try another coupon.'})
            }
        }else{
            return res.status(301).json({status : 301 ,  message: 'Coupon invalid! please use a valid Coupon.'})
        }
    }
}