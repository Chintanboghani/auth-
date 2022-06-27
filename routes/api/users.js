const router = require('express').Router();

const { verifyJwtToken } = require('../../configs/jwtHelper');
const USER = require('../../controllers/api/user.controller');
const { cpUpload } = require("../../utils/multer");


//get all user 
router.get('/' ,verifyJwtToken, USER.getAllUser);
//Params are available in req.params
router.get('/me',verifyJwtToken, USER.getLoggedInUser);
//UPDATE user profile details update
router.patch('/me/:id', verifyJwtToken, USER.updateUserDetails);

//get all user according to user role 
router.get('/user/:userRole', verifyJwtToken,USER.getAllUserByRole);

router.post('/generatepdf', USER.generatePdf);

module.exports = router;

 
