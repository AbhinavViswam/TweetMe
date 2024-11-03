const express=require("express")
const sendTweet = require("../controller/tweet.controller.js")
const router=express.Router()


router.route("/:userId")
.post((req,res)=>{
    sendTweet(req,res);
})



module.exports=router;