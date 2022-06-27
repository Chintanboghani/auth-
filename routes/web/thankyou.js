const router = require('express').Router();
// API


router.get("/thankYou", (req, res) => {
        res.render("thankYou/index");
});
module.exports = router;