const express=require("express")
const {registerUser,loginUser} = require("../controller/user.controller")
const router=express.Router()


router.route("/register")
.post((req,res)=>{
    registerUser(req,res)
})

router.route("/login")
.post((req,res)=>{
    loginUser(req,res)
})


module.exports=router