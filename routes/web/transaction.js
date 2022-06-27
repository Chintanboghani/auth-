const router = require('express').Router();
const transaction = require('../../controllers/web/transaction');

// API
router.get('/', (req,res)=>res.render('pages/transaction'));
router.post('/find', transaction.find);

module.exports = router;