const User = require('../models/user.models.js')
const bcrypt = require('bcrypt')
const crypto=require("crypto")
const generateAccessToken = require("../middleware/accesstoken.middleware.js")
const Follow=require("../models/follow.models.js")

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
        const hashedPassword= await bcrypt.hash(password,10)
        const saveUser = await User.create({
            fullname,
            email,
            password:hashedPassword,
            username
        })
        if (!saveUser) {
            return res.status(500).json({ e: "Internal error" })
        }
        return res.status(200).json({m:"User registered"})

    } catch (err) {
        res.status(500).json({ e: "Unknown error occured" })
    }
}

const loginUser = async (req, res) => {
    const {emailOrUsername, password } = req.body
    if (!emailOrUsername || !password) {
        return res.status(400).json({ e: "All fields are required" })
    }
    try {
        const user = await User.findOne({
            $or:[
                {username:emailOrUsername},
                {email:emailOrUsername}
            ]
        });
        if (!user) {
            return res.status(404).json({ e: `${email} not registered` })
        }
        const passwordIsMatch = await bcrypt.compare(password, user.password);
        if (!passwordIsMatch) {
            return res.status(400).json({ e: "Incorrect Password" })
        }
        const accesstoken = generateAccessToken(user);
        res.cookie('accessToken', accesstoken, { httpOnly: true,sameSite:'Strict' });
        if(user.role=='admin'){
            res.status(200).json({ m: `,Hello ADMIN, Successfully logged in as ${emailOrUsername}` });
        }
        else{
            res.status(200).json({ m: `Successfully logged in as ${emailOrUsername}` });
        }
    } catch (err) {
        res.status(500).json({ e: "Unknown error occured" })
    }
}


const logoutUser=async(_,res)=>{
   try {
     res.clearCookie('accessToken');
     res.status(200).json({m:"User logged out"})
   } catch (error) {
    res.status(500).json({e:"Some internal error occured"})
   }
}

const resetPasswordLink=require("../middleware/nodemailer.middleware.js")

const forgotPassword=async(req,res)=>{
    const {email}=req.body
    if(!email){
        return res.status(400).json({e:"Email field is empty"})
    }
    try {
        const user=await User.findOne({email})
        if(!user){
            return res.status(404).json({e:"No user found"})
        }
        const resetToken=crypto.randomBytes(32).toString("hex")
        user.resetToken=resetToken
        user.resetTokenExpiry = Date.now() + 3600000;
        await user.save()
        const resetLink=`${process.env.RESET_LINK}/reset-password/${resetToken}`;
        await resetPasswordLink(email,resetLink)
        return res.status(200).json({m:"Reset password link sent to your email"})
    } catch (error) {
        return res.status(500).json({e:"Internal Error"})
    }
}

const resetPassword=async(req,res)=>{
    const {token}=req.params
    const {newPassword}=req.body
    if(!newPassword){
        return res.status(400).json({e:"No password entered"})
    }
   try {
     const user=await User.findOne({
         resetToken:token,
         resetTokenExpiry:{
             $gt:Date.now()
         }
     })

     if(!user){
         return res.status(401).json({e:"Invalid or expired link"})
     }

     const hashedPassword=await bcrypt.hash(newPassword,10)
     user.password=hashedPassword
     user.resetToken=undefined;
     user.resetTokenExpiry=undefined;
     await user.save()
     return res.status(200).json({m:"new password saved"});
   } catch (error) {
    return res.status(500).json({e:"Internal Error"})
   }
}

const changeCurrentPassword=async(req,res)=>{
    const userid=req.user._id
    const {currentPassword,newPassword}=req.body;
    try {
        if(!(currentPassword || newPassword)){
            return res.status(400).json({e:"All fields are required"})
        }
        const user=await User.findById(userid);
        const isPasswordMatch=await bcrypt.compare(currentPassword,user.password)
        if(!isPasswordMatch){
            return res.status(401).json({e:"Current password doesnot match"})
        }
        const hashedPassword=await bcrypt.hash(newPassword,10);
        user.password=hashedPassword;
        await user.save();
        return res.status(200).json({m:"password changed successfully"})
    } catch (error) {
        res.status(500).json({e:"Some internal error occured"})
    }
}

const updateUserDetails=async(req,res)=>{
    const {fullname,bio,dob}=req.body
    if(!(fullname || bio || dob)){
        return res.status(400).json({e:"All fields are required!"})
    }
   try {
     const user=await User.findByIdAndUpdate(
         req.user?._id,
         {
             $set:{
                 fullname,
                 bio,
                 dob
             }
         },
         {new:true}
     ).select("-_id fullname bio dob")
     return res.status(200).json({m:"User details updated",o:user})
   } catch (error) {
    res.status(500).json({e:"Some internal error occured"})
   }
}

const updateUsername=async(req,res)=>{
    const {username}=req.body
    if(!username){
        res.status(400).json({e:"All fields are required"})
    }
   try {
     const usernameExists=await User.findOne({username})
     if(usernameExists){
         return res.status(400).json({e:"Username already taken"})
     }
     const user=await User.findByIdAndUpdate(req.user?._id,
         {
             $set:{
                 username
             }
         },{new:true}
     ).select("username")
     return res.status(200).json({m:"Username Updated",o:user})
   } catch (error) {
    res.status(500).json({e:"Some internal error occured"})
   }
}

const showUser=async(req,res)=>{
    const {username}=req.params;
    try{
    const userFound=await User.findOne({username})
    if(!userFound){
        return res.status(404).json({e:"User not Found"})
    }
    const user=await User.aggregate([
        {
            $match:{
                username:username?.toLowerCase()
            }
        },
        {
            $lookup:{
                from:"tweets",
                localField:"_id",
                foreignField:"userid",
                as:"tweetsdetails"
            }
        },
        {
            $lookup:{
                from:"follows",
                localField:"_id",
                foreignField:"followingId",
                as:"myFollowers"
            }
        },
        {
            $lookup:{
                from:"follows",
                localField:"_id",
                foreignField:"followerId",
                as:"meFollowings"
            }
        },
        {
            $addFields:{
                follower_count:{
                    $size:"$myFollowers"
                },
                following_count:{
                    $size:"$meFollowings"
                }
            }
        },
        {
            $project:{
                _id:0,
                username:"$username",
                fullname:"$fullname",
                follower_count:1,
                following_count:1,
                bio:"$bio",
                tweet:["$tweetsdetails.tweet","$tweetsdetails.createdAt"]
            }
        } 
    ])
    res.status(200).json({m:user})
}catch(err){
    res.status(500).json({e:"Some internal error occured"})
}
} 

const follow=async(req,res)=>{
    const {followingId}=req.body
    const followerId=req.user?._id
    try {
        if(!(followerId || followingId)){
            return res.status(400).json({e:"FollowerId and FollowingId are required fields"})
        }
        await Follow.create({
            followerId,
            followingId
        })
        const following_user=await User.findById(followingId)
        res.status(200).json({m:`You are now following ${following_user.username}`})
    } catch (error) {
        return res.status(500).json({e:"Internal error occured"})
    }
}

const searchUser = async(req,res)=>{
    const {username}=req.body
    if(!username){
        return res.status(400).json({e:"All fields are required"})
    }
    try {
        const user=await User.findOne({username}).select("username email -_id")
        if(!user){
            return res.status(404).json({e:"user not found"})
        }
        return res.status(200).json({m:"User Found",o:user})
    } catch (error) {
        return res.status(500).json({e:"Internal error"})
    }
}

module.exports = { registerUser, loginUser,logoutUser,changeCurrentPassword,updateUserDetails,updateUsername,showUser,follow,forgotPassword,resetPassword ,searchUser};