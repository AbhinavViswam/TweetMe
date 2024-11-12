const express=require("express")
const {sendTweet,showTweet} = require("../controller/tweet.controller.js")
const router=express.Router()

router.route("/")
.get((req,res)=>{
    showTweet(req,res)
})

router.route("/:userId")
.post((req,res)=>{
    sendTweet(req,res);
})

module.exports=router;