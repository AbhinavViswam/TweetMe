const express=require("express")
const verifyJwt=require("../middleware/verifyToken.middleware.js")
const {sendTweet,showTweet,like,unlike} = require("../controller/tweet.controller.js")
const router=express.Router()

router.route("/").get(verifyJwt,showTweet)
 
router.route("/posttweet").post(verifyJwt,sendTweet)
 
router.route("/like").post(verifyJwt,like)

router.route("/unlike").post(verifyJwt,unlike)

module.exports=router;