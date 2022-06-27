const router = require('express').Router();
const coupon = require('../../controllers/web/coupon');

// API
router.get('/', (req,res)=>res.render('pages/coupon'));

router.post('/coupon_create', coupon.create_coupon);
router.post('/find', coupon.find);
router.put('/update/:id', coupon.update);
router.delete('/delete/:id', coupon.delete); 

module.exports = router;