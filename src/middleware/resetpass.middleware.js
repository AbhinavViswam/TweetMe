const allowVerifyOTP=async(req,res,next)=>{
    const token=req.cookies._otp;
    if(!token) return res.status(404).json({e:"No OTP generated or OTP expired"})
    next();
}

const allowSetNewPassword=async(req,res,next)=>{
    const done=req.cookies._done;
    if(!done){
        return res.status(400).json({e:"Generate OTP first"})
    }
    next();
}

module.exports={allowVerifyOTP,allowSetNewPassword}