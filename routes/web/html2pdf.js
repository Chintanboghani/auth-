const router = require('express').Router();
const { log } = require('console');
const fs = require("fs");
const pdf = require("html-pdf");
let options = { format: 'A4',
// footer: {
//     height: '10mm',
//     contents: {
//       default:
//         '<div id="pageFooter" style="text-align: center; font-size: 12px;">{{page}}/{{pages}}</div>',
//     }
// },
};
const fetch = require("node-fetch");

router.get("/:id/:application_number",(req,res)=>{
    var body = {
        "application_number": req.params.application_number
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
            pdf.create(html, options).toFile('./public/upload/'+application_number+'_Pdf.pdf', function(err, result) {
                if (err){
                    return console.log(err);
                }else{
                    const datafile = fs.readFileSync('./public/upload/'+application_number+'_Pdf.pdf');
                    res.header("content-type","application/pdf");
                    res.send(datafile);
                } 
            });
        }); 
    });
});

module.exports = router; 