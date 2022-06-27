const router = require('express').Router();

const UTILITY = require('../../controllers/api/utility.controller.js');
const { imgupload } = require("../../utils/multer");
const { verifyJwtToken } = require('../../configs/jwtHelper');

//Logo UPLOAD
router.post('/upload', imgupload, UTILITY.saveLogo);

module.exports = router;

 
