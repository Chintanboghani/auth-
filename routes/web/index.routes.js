
const router = require('express').Router();
const  auth   = require('../../middelware/auth')

router.get('/' , auth,(req, res) => {
    res.render("pages/dashboard");
});

 router.get('/dashboard' , auth,(req, res) => {
     res.render("pages/dashboard");
 });
 router.get('/login' , (req, res) => {
    res.render("pages/login");
 });


// [ROOT]
router.use("/auth",       require("./adminlogin"))
router.use("/coupon",  auth,   require("./coupon"))
router.use('/users',  auth,    require('./users'));
router.use('/transaction',  auth,    require('./transaction'));
router.use("/html2pdf", require("./html2pdf"))
router.use("/preview", require("./preview"))
router.use("/thankyou", require("./thankyou"));
module.exports = router;