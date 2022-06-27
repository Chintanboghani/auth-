const router = require('express').Router();
const pdf = require('../../controllers/api/pdfdownload.controller');
const { verifyJwtToken } = require('../../configs/jwtHelper');

router.get('/:order_id/download',pdf.pdfdownload );
module.exports = router;