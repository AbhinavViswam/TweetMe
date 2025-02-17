const User=require("../models/user.models.js")
const jwt=require("jsonwebtoken")

const verifyJwt=async(req,res,next)=>{
    try {
        const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
        if(!token){
            return res.status(401).json({e:"Unauthorized"})
        }
        const decoded_token=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        const user= await User.findById(decoded_token._id).select("-password")
        if(!user){
            return res.status(401).json({e:"Unauthorized user"})
        }
        req.user=user
        next();
    } catch (error) {
        return res.status(500).json({e:"Error with token"})
    }
}

module.exports=verifyJwt;