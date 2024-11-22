const express=require("express")
const { registerUser, verifyUserRegistration, loginUser,forgotPassword ,verifyPasswordResetOTP,setNewPassword,logoutUser,changeCurrentPassword,getCurrentUser,updateUserDetails,updateUsername,showUser} = require("../controller/user.controller")
const {allowVerifyOTP,allowSetNewPassword} = require("../middleware/resetpass.middleware.js")
const router=express.Router()

router.route("/register")
.post((req,res)=>{
    registerUser(req,res)
})

router.route("/verify-register")
.post((req,res)=>{
    verifyUserRegistration(req,res)
})

router.route("/login")
.post((req,res)=>{
    loginUser(req,res)
})

router.route("/forgotpassword")
.post((req,res)=>{
    forgotPassword(req,res)
})

router.route("/verifypasswordotp")
.post(allowVerifyOTP,(req,res)=>{
    verifyPasswordResetOTP(req,res)
})

router.route("/setnewpassword")
.post(allowSetNewPassword,(req,res)=>{
    setNewPassword(req,res)
})

router.route("/:username")
.get((req,res)=>{
    showUser(req,res)
})

module.exports=router