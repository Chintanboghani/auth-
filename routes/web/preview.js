const router = require('express').Router();
const fetch = require("node-fetch");

router.get("/:id/:application_number",(req,res)=>{
    var body = {
        "user_id": req.params.id,
        "application_number": req.params.application_number
    }; 

    fetch(process.env.HOST_URL+'/api/v2/userProgress/retrieveUserProgess',{
        method: 'post',
        body: JSON.stringify(body),
        headers: {'Content-Type': 'application/json'}
    }).then(res => res.json()).then(function(response) {
    if(!response.error){
        var result = response.data.last_filled_data;
        var data = response.data;
        res.render("preview/index",{result, data});
    }   
    });
});

module.exports = router; 