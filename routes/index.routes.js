

const router = require('express').Router();
const { printRequestLogger }  = require('../configs/app_setting');

/*
 * PASS "/api/v1" REQUEST TO API routes
 */
router.use('/api/v1', printRequestLogger,require('./api/index.routes'));
router.use('/api/v2', printRequestLogger,require('./api/v2/index.routes'));

/*
 * PASS "/" REQUEST TO WEB panel
 */
 router.use('/admin', printRequestLogger,require('./web/index.routes'));


module.exports = router;
