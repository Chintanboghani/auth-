const router = require('express').Router();
const USERPROGRESS = require('../../../controllers/api/v2/userProgress.controller.js');
const { verifyJwtToken } = require('../../../configs/jwtHelper');

router.post('/saveUserProgess',verifyJwtToken, USERPROGRESS.saveUserProgess);
router.post('/retrieveUserProgess',  USERPROGRESS.retrieveUserProgess);

module.exports = router;