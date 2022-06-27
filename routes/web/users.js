const router = require('express').Router();

const USER = require('../../controllers/web/users');
router.get('/', (req,res)=>res.render('pages/users'));

router.post('/data', USER.getAllUsers);

router.put('/:id/updateRole', USER.updateRole);

module.exports = router;