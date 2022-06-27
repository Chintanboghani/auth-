
const router = require('express').Router();

// [ROOT]
router.use("/auth",        require( "./auth"));
router.use("/userProgress",        require( "./userProgress"));


module.exports = router;