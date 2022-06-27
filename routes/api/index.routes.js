
const router = require('express').Router();


// [ROOT]
router.use("/users",       require( "./users"));
router.use("/auth",        require( "./auth"));
router.use("/utility",        require( "./utility"));
router.use("/userProgress",        require( "./userProgress"));
router.use("/checkout",        require( "./checkout"));
router.use("/coupon",        require( "../web/coupon"));
router.use("/verifyCoupon",        require( "./verifyCoupon"));
router.use("/pdf",           require('./pdfdownload'));


module.exports = router;