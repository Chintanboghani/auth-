
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const coupon = new Schema({
    code : {
        type : String,
        uppercase: true
    },
    start_date           :{type:String},
    End_date             :{type:String},
    Total_coupon         :{type:Number},
    Discounts_Percentage :{type:Number},
    used_coupon          :{type:Number,default:0},
    remaining_coupon     :{type:Number,default:0},
    status               :{type:Boolean,default:false}
    }, {
        timestamps: true,
    });

module.exports = mongoose.model('coupon', coupon, 'coupon');
