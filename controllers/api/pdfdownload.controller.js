
const db = require("../../models/index");
const USERPROGRESSMODEL = db.userprogress;
const ORDERSUMMARYMODEL = db.ordersummary;
const pdf2base64 = require('pdf-to-base64');

module.exports = {
    pdfdownload : async (req, res) => {
        const orderId = req.params.order_id;
        const orderData = await ORDERSUMMARYMODEL.findOne({ _id: orderId }).lean();
        const progressData = await USERPROGRESSMODEL.findOne({ _id: orderData.progress_id }).lean();
        var application_number = progressData.application_number;
        var user_id = orderData.user_id;
        const file = ("./public/upload/pdf/"+application_number+"_Pdf.pdf");
        pdf2base64(file)
        .then(
            (response) => {
                res.send({status:200, message:response });
            }
        )
        .catch(
            (error) => {
                res.send({status:301, message:response });
            }
        )
    }
}