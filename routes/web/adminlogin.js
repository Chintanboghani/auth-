const router = require('express').Router();

const AUTH = require('../../controllers/web/adminlogin');

router.post('/login', AUTH.adminlogin);

module.exports = router;