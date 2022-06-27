const router = require('express').Router();

const AUTH = require('../../controllers/api/auth.controller.js');
const { imgupload } = require("../../utils/multer");
const { verifyJwtToken } = require('../../configs/jwtHelper');

//LOGIN
router.post('/login', AUTH.login);
//REGISTER users
router.post('/register', AUTH.register);
//FORGOT PASSWORD
router.post('/forgot/password', AUTH.forgot);
//RESET PASSWORD
router.post('/reset/password', AUTH.reset);
//LOUGOU
router.post('/logout/:id', verifyJwtToken, AUTH.logout);

module.exports = router;

 
