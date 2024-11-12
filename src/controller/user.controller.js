const User = require('../models/user.models.js')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const generateAccessToken = require("../middleware/accesstoken.middleware.js")
const genOTP = require("../middleware/otp.middleware.js")
const { createSearchIndex } = require('../models/tweet.models.js')

const registerUser = async (req, res) => {
    const { fullname,username ,email, password } = req.body;
    if (!fullname || !username || !email || !password) {
        return res.status(400).json({ e: "All Fields are required" })
    }
    try {
        const userEmail = await User.findOne({ email })
        const userUsername=await User.findOne({ username })
        if (userEmail) {
            return res.status(409).json({ e: "This email is already registered" })
        }
        if (userUsername) {
            return res.status(409).json({ e: "This Username is already taken" })
        }
        const otp = await genOTP(email,"OTP for your registration is");
        const hashedPassword = await bcrypt.hash(password, 10);
        const regToken = jwt.sign(
            { fullname, email, password: hashedPassword, otp,username },
            process.env.JWT_SECRET,
            { expiresIn: '10m' }
        );

        res.cookie('_regToken', regToken, { httpOnly: true, maxAge: 600000 }).status(200).json({ m: "An otp has been send to your email to confirm registration" });
    } catch (err) {
        res.status(500).json({ e: "Unknown error occured" })
    }
}
const verifyUserRegistration = async (req, res) => {
    const { otpInput } = req.body;
    try {
        const regToken = req.cookies._regToken;
        const decodedToken = jwt.verify(regToken, process.env.JWT_SECRET);
        const { fullname, email, password, otp,username } = decodedToken;
        if (otpInput !== otp) {
            return res.status(401).json({ e: "Invalid OTP" })
        }
        const saveUser = await User.create({
            fullname,
            email,
            password,
            username
        })
        if (!saveUser) {
            return res.status(500).clearCookie('_regToken').json({ e: "Internal error" })
        }
        res.clearCookie('_regToken');
        res.status(200).json({ m: `${fullname} registered successfully` })
    } catch (err) {
        res.status(500).json({ e: "Unknown error occured" })
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ e: "All fields are required" })
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ e: `${email} not registered` })
        }
        const passwordIsMatch = await bcrypt.compare(password, user.password);
        if (!passwordIsMatch) {
            return res.status(400).json({ e: "Incorrect Password" })
        }
        const accesstoken = generateAccessToken(user);
        res.cookie('accesstoken', accesstoken, { httpOnly: true });
        res.status(200).json({ m: `Successfully logged in as ${email}` });
    } catch (err) {
        res.status(500).json({ e: "Unknown error occured" })
    }
}

const forgotPassword=async(req,res)=>{
    const {email}=req.body;
    if(!email){
        return res.status(400).json({e:"email field is required"})
    }
    try {
        const user=await User.findOne({email})
        if(!user){
            return res.status(404).json({e:"User not found"})
        }
        const otp=await genOTP(email,"Your request for password reset OTP is")
        if(!otp){
            return res.status(500).json({e:"Some internal error occured"})
        }
        const otpToken=jwt.sign({otp,email},process.env.JWT_SECRET,{expiresIn:"10m"})
        res.cookie('_otp',otpToken,{httpOnly:true,maxAge:15 * 60 * 1000}).status(200).json({m:"an otp to reset password is sent to your email"});
    } catch (error) {
        return res.status(500).json({e:"internal error occured"})
    }
}

const verifyPasswordResetOTP=async(req,res)=>{
    const{otpInput}=req.body
    if(!otpInput){
        return res.status(400).json({e:"Otp field is required"})
    } 
   try {
     const otpToken=req.cookies._otp;
     if(!otpToken){
         return res.status(400).json({e:"OTP Expired"})
     }
     const otp=jwt.verify(otpToken,process.env.JWT_SECRET)
     if(otpInput!==otp.otp){
         return res.status(400).json({e:"Invalid OTP"})
     }
     res.status(200).cookie('_done',1,{httpOnly:true,maxAge:15 * 60 * 1000}).json({m:"you can reset your password"})
   } catch (error) {
    return res.status(500).json({e:"internal error occured"})
   }
}

const setNewPassword=async(req,res)=>{
    const {pass,confirmpass}=req.body
    if(pass!==confirmpass){
        return res.status(400).json({e:"passwords doesnt match"})
    }
    try {
        const otpToken=req.cookies._otp;
        const email1=jwt.verify(otpToken,process.env.JWT_SECRET)
        if(!email1){
            return res.status(400).json({e:"OTP Expired"})
        }
        const email=email1.email
        const user=await User.findOne({email})
        if(!user){
            return res.status(404).json({e:"User doesnot exists"})
        }
        user.password=pass;
        await user.save()
        res.clearCookie('_otp').clearCookie('_done');
        res.status(200).json({m:"password set successfully"});
        
    } catch (error) {
        return res.status(500).json({e:"internal error occured"})
    }
}

module.exports = { registerUser, verifyUserRegistration, loginUser,forgotPassword ,verifyPasswordResetOTP,setNewPassword};