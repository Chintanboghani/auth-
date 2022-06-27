const USERPROGRESS = require('../../models/userProgress');
const ORDERSUMMARY = require('../../models/order_summary');
const DATATABLEWEB = require("../../helper/web/dataTable");

exports.find = async(req, res, next)=>{
    try{
        var modelObj = USERPROGRESS;
        var searchFields = ['user_email'];

        var aggregateQuery = [
            { $lookup: { from: "order_summary", localField: "_id", foreignField: "progress_id", as: "order_summary" } },
            { $unwind: {path: "$order_summary", preserveNullAndEmptyArrays: true} },
            
            { $lookup: { from: "transaction_history", localField: "_id", foreignField: "progress_id", as: "transaction_history" } },
            { $unwind: {path: "$transaction_history", preserveNullAndEmptyArrays: true} },
        ];
        
        var modelObj = USERPROGRESS;
        var sortingQuery = { createdAt: -1 };
  
        DATATABLEWEB.fetchAggregateDatatableRecords(req.body, modelObj, searchFields, aggregateQuery, sortingQuery, function(err, data) {
          if(err) {
            res.status(200).send({
              "draw": 1,
              "recordsFiltered": 0,
              "recordsTotal": 0,
              "data": []
            });
          }else{
            var jsonString = JSON.stringify(data);
            console.log(jsonString);
            res.send(jsonString);
          }
        });
    }catch(err){
        next(err);
    }
}
