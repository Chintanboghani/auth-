
module.exports = {
    saveLogo :(req,res,next)=>{
    try {
      res.status(201).json({ status:200, message: "Profile picture uploaded successfully", data: req.file });
    } catch (error) {
      console.log(error);
    }
  }
};