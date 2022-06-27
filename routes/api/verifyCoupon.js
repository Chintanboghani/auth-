const router = require('express').Router();
const couponverify = require('../../controllers/api/verifycoupon.controller');
const { verifyJwtToken } = require('../../configs/jwtHelper');

router.post('/verifyCoupon',verifyJwtToken,couponverify.verifyCoupon );
module.exports = router;