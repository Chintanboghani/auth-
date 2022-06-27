const coupon = require('../../models/coupon');
const { coupon_validation } = require("../../validations/coupon.validation");
const {COUPON_STATUS} = require('../../utils/constants');
const DATATABLEWEB = require("../../helper/web/dataTable");
const moment = require('moment')

exports.create_coupon = async(req,res,next)=>{    
    try {
        const validate = coupon_validation(req.body);
        const { error } = validate;
        if (error)  return res.status(301).send({ status: 301, message: error.details[0].message });
        const payload = req.body;
        const start_date = moment(req.body.start_date).format("MM-DD-YYYY");
        const End_date = moment(req.body.end_date).format("MM-DD-YYYY");
        const coupon_data = await coupon.findOne({code : payload.code});
        if (coupon_data) 
            return res.status(302).send({status:302, message: `${payload.code} coupon is already created.` });
        else{
            const user = new coupon({
                code : payload.code,
                start_date : start_date,
                End_date: End_date,
                Total_coupon : payload.total_coupon,
                remaining_coupon : payload.total_coupon,
                Discounts_Percentage : payload.discount
            })
            
            await user.save()
            return res.status(200).json({status:200, message: "Coupon is created" });
        }
      }
      catch (err) { next(err); 
    }
}

// retrieve and return all users/ retrive and return a single user
exports.find = async(req, res, next)=>{
    try{
        var modelObj = coupon;
        var searchFields = ['code', 'start_date','End_date'];
        var conditionQuery = { isDeleted: false };
        var projectionQuery = '-createdAt -updatedAt -__v';
        var sortingQuery = { createdAt: -1 };
        var populateQuery = [];
  
        DATATABLEWEB.fetchDatatableRecords(req.body, modelObj, searchFields, conditionQuery, projectionQuery, sortingQuery, populateQuery, function (err, data) {
            if(err) {
                res.status(200).send({
                    "draw": 1,
                    "recordsFiltered": 0,
                    "recordsTotal": 0,
                    "data": []
                });
            }else{
                var jsonString = JSON.stringify(data);
                res.send(jsonString);
            }          
        });
    }catch(err){
        next(err);
    }
}

// Update a new idetified user by user id
exports.update = async(req, res, next)=>{
    try {
        const payload = req.body;      
        const id = req.params.id; 
        if(payload.status === true || payload.status === false || payload.status === 'true' || payload.status === 'false'){
            const updateStatus = await coupon.findOneAndUpdate({ _id: id }, { $set: { status: payload.status} },{new:true})
            return res.status(200).json({status:200,message:"Update status successfully", data:updateStatus})    
        }else{
            const validate = coupon_validation(req.body);
            const { error } = validate;
            if (error)
                return res.status(301).send({ status: 301, message: error.details[0].message });
                const start_date = moment(req.body.start_date).format("MM-DD-YYYY");
                const End_date = moment(req.body.End_date).format("MM-DD-YYYY");
                
                const coupondata = await coupon.findOne({_id: id});
                if(coupondata.code == payload.code){
                    return res.status(404).json({status:404,message:"Coupon is already Created"})
                }

                if (payload.total_coupon >= coupondata.used_coupon) {
                    const  remaining_coupon_update = payload.total_coupon - coupondata.used_coupon;
                    const updatedata = await coupon.findOneAndUpdate({ _id: id }, { $set: { code: payload.code, start_date: start_date, End_date: End_date, Total_coupon: payload.total_coupon, Discounts_Percentage: payload.discount ,remaining_coupon:remaining_coupon_update} },{new:true})
                    if(updatedata){
                        return res.status(200).json({status:200,message:"Update coupon successfully", data:updatedata})
                    }
                }else{
                    return res.status(404).send({status:404, message : `The total coupon should not exceed the used coupon of that coupon`})
                }
        }       
    }
    catch (err) { next(err); }
}

// Delete a user with specified user id in the request
exports.delete =async (req, res)=>{
    const id = req.params.id;

   const deletedata = await coupon.findByIdAndDelete(id)
        .then(data => {
            if(!data){
                res.status(404).send({status:404, message : `Cannot Delete with id ${id}. Maybe id is wrong`})
            }else{
                res.status(200).json({
                  status:200,  message : "User was deleted successfully!"
                })
            }
        })
        .catch(err =>{
            res.status(500).send({
              status:500,  message: "Could not delete User with id=" + id
            });
        });
}