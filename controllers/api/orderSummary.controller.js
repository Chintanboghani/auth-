const { ORDER_SUMMARY } = require("../../validations/checkoutValidation");
const db = require("../../models/index");
const { PAYMENT_STATUS } = require('../../utils/constants');
const ORDERSUMMARYMODEL = db.ordersummary;
const USERPROGRESSMODEL = db.userprogress;

module.exports = {
    order_summary: async (req, res, next) => {
        try {
            // Validate
            const validate = ORDER_SUMMARY(req.body);
            const { error } = validate;
            if (error) return res.status(301).send({ status: 301, message: error.details[0].message });
            const payload = req.body;

            let userProgress = await USERPROGRESSMODEL.findOne({_id: payload.progress_id, user_id: payload.user_id});
            if (!userProgress) return res.send({status:422, message: "You don't have account with given info." });

            let order_summary_data = await ORDERSUMMARYMODEL.findOne({progress_id: payload.progress_id, user_id: payload.user_id});

            if(order_summary_data){
                res.status(200).json({status:200, message: "Order summary successfully.", data: order_summary_data });
            }else{
                const bill_type = req.body.bill_type;
                const bill_type_replace = bill_type.toUpperCase().split(' ').join('_');
                const order_summary_payload = new ORDERSUMMARYMODEL({
                    user_id       : payload.user_id,  
                    progress_id   : payload.progress_id,     
                    payment_amount: process.env[bill_type_replace+'_AMOUNT'], 
                    payment_status: PAYMENT_STATUS.PENDING,
                    bill_type     : payload.bill_type,
                    apply_coupon  : payload.apply_coupon
                });
                const order_summary = await order_summary_payload.save();
                res.status(200).json({status:200, message: "Order summary successfully.", data: order_summary });
            }
           
        } catch (error) {
            res.send(error);
        }
    }
};
