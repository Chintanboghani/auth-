const router = require('express').Router();
const USERPROGRESS = require('../../controllers/api/userProgress.controller.js');
const { verifyJwtToken } = require('../../configs/jwtHelper');

router.post('/saveUserProgess',verifyJwtToken, USERPROGRESS.saveUserProgess);
router.post('/previewUserProgess',verifyJwtToken, USERPROGRESS.previewUserProgess);
router.post('/userProgessReport',verifyJwtToken, USERPROGRESS.userProgessReport);
router.post('/deleteUserProgess',verifyJwtToken, USERPROGRESS.deleteUserProgess);
router.post('/retrieveUserProgess', USERPROGRESS.retrieveUserProgess);

module.exports = router;