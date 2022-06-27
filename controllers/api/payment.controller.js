const { TRANSICTION } = require("../../validations/checkoutValidation");
const db = require("../../models/index");
const { Client, resources } = require('coinbase-commerce-node');
const { Charge } = resources;
const TRANSECTION_HISTORY = db.transection_history;
const ORDERSUMMARYMODEL = db.ordersummary;
const USERMODEL = db.user;
const USERPROGRESSMODEL = db.userprogress;
const USERPROGRESS = require('../../models/userProgress');

Client.init(process.env.COINBASE_API_KEY);

const success_payment = async (order_id) => {
  try {
    return process.env.FRONTEND_URL + `/application-success?order_id=` + order_id;
  } catch (err) { console.log(err) }
}

const cancel_payment = async () => {
  try {
    return process.env.FRONTEND_URL + `/order`;
  } catch (err) { console.log(err) }
}

module.exports = {

  coinbase_payment: async (req, res, next) => {
    const payload = req.body;

    const validate = TRANSICTION(req.body);
    const { error } = validate;
    if (error) return res.status(301).send({ status: 301, message: error.details[0].message });

    const progress_id = payload.progress_id;
    const order_id = payload.order_id;
    const amount = payload.amount;

    let order_summary = await ORDERSUMMARYMODEL.findOne({ _id: order_id, progress_id: progress_id });
    if (!order_summary) return res.send({ status: 422, message: "You don't have order with given info." });

    let transaction_data = await TRANSECTION_HISTORY.findOne({ order_id: order_id, progress_id: progress_id });
    if(transaction_data){
      await TRANSECTION_HISTORY.deleteOne({ order_id: order_id, progress_id: progress_id });
    }

    const chargeData = {
      name: 'Bill Generator',
      description: 'Mastering the Transition to the Information Age',
      local_price: {
        amount: amount,
        currency: 'USD'
      },
      pricing_type: 'fixed_price',
      cancel_url: await cancel_payment(),
      redirect_url: await success_payment(order_id)
    }

    const charge = await Charge.create(chargeData);

    const newUser = new TRANSECTION_HISTORY({
      order_id: order_id,
      progress_id: progress_id,
      coinbase_id: charge.id,
      coinbase_data: charge,
    });
    const a = await newUser.save();

    return res.status(200).send({status:200, data: charge });
  },
  
  getAllTransectionData: async (req,res,next)=>{
    try {
      // let users =  await USERMODEL.find({isDeleted:false},'email');
      // let userProgress;
      // userProgress = await USERPROGRESSMODEL.find({user_id: users._id});

      // users = users.concat(userProgress);

      var aggregateQuery = [
        { $lookup: { from: "order_summary", localField: "_id", foreignField: "progress_id", as: "userProgessData" } },
        { $lookup: { from: "transaction_history", localField: "_id", foreignField: "progress_id", as: "transaction_history" } },
        { $unwind: {path: "$transaction_history",preserveNullAndEmptyArrays: true} },
       
    ];

    const recordsFilteredCount = await USERPROGRESS.aggregate(aggregateQuery);

      // const responseData = await Promise.all(users.map(async user => {
      //   user = user.toJSON();
      //   // const userProgress = await USERPROGRESSMODEL.find({user_id: user._id});
        
      //   // console.log(userProgress);
      //   return user
      // }));

     return res.status(200).send({ status: 200, message: "success", data:recordsFilteredCount });
     
    } catch (err) {
      console.log(err);
    }
  }

};