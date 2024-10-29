const express=require("express")
const registerUser = require("../controller/user.controller")
const router=express.Router()


router.route("/register")
.post((req,res)=>{
    registerUser(req,res)
})



module.exports=router