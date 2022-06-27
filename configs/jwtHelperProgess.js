const jwt = require("jsonwebtoken");

module.exports.verifyJwtToken = (req, res, next) => {
  var token;
  var expireTime;
  // jwtUserId

  if(req.headers){
    if ("authorization" in req.headers) token = req.headers["authorization"].split(" ")[1];
    if (!token) return res.status(403).send({ status: 403, auth: false, message: "Authorization Token Required." });
  
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) return res.status(403).send({ status: 403, auth: false, message: "Token authentication failed." });
        //append userId to jwtUserId in req
        req.jwtUserId = decoded._id;
        req.expireTime = decoded.exp;
        if ("refreshtoken" in req.headers) {
          var newToken = jwt.sign({ _id: req.jwtUserId }, process.env.TOKEN_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
          });
          req.responseBody = { token: newToken };
        } else {
          req.responseBody = {};
        }
        next();   
    
    });
  }else{
    next();   
  }
};