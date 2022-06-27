const auth = async (req,res,next )=>{
    if (!req.session.email) {
        res.render('pages/login');
    } 
    next()
}
module.exports = auth;