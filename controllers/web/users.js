const USER = require('../../models/user');
const DATATABLEWEB = require("../../helper/web/dataTable");

exports.getAllUsers = async(req,res,next)=>{    
    try {
        var modelObj = USER;
        var searchFields = ['user_name', 'email'];
        var conditionQuery = {  };
        var projectionQuery = '-createdAt -updatedAt -__v -isDeleted -password ';
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
      }
      catch (err) { next(err); }
},

exports.updateRole = async(req,res,next)=>{    
    try {
        const userId = req.params.id;
        const userRole = req.body.userRole;

        let currentUser = await USER.findOne({ _id: userId });
        if (!currentUser) throw new APIError({ status: 422, message: 'User not found.' });

        const updateReocord = await USER.findOneAndUpdate({ _id: currentUser.id }, { $set: { userRole: userRole } });

        res.send({ status: 200, message: "Your User role has been changed", data: updateReocord })
    }
    catch (err) { next(err); }
}
