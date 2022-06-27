const router = require('express').Router();
const ORDERSUMMARY = require('../../controllers/api/orderSummary.controller');
const PAYMENT = require('../../controllers/api/payment.controller');
const { verifyJwtToken } = require('../../configs/jwtHelper');


router.post('/order_summary', ORDERSUMMARY.order_summary);
router.post('/coinbase_payment',verifyJwtToken,PAYMENT.coinbase_payment);
router.get('/transiction_list',verifyJwtToken,PAYMENT.getAllTransectionData);
  
module.exports = router;