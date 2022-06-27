const router = require('express').Router();

const AUTH = require('../../../controllers/api/v2/auth.controller.js');

router.post('/register', AUTH.register);


module.exports = router;