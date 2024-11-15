const jwt=require("jsonwebtoken")

const generateAccessToken=(user)=>{
try{
    const token=jwt.sign(
    {
        _id:user._id,
        fullname:user.fullname,
        email:user.email,
        role:user.role
    },
process.env.ACCESS_TOKEN_SECRET,
{ expiresIn:process.env.ACCESS_TOKEN_EXPIRY }
)
    return token;
}
catch(err){
    res.status(500).json({e:"Unknown error occured"})
}
}
module.exports=generateAccessToken;