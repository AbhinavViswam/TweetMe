const express=require("express")
const verifyJwt=require("../middleware/verifyToken.middleware.js")
const {sendTweet,showTweet,like,unlike,addComment,getComments,deleteComment} = require("../controller/tweet.controller.js")
const router=express.Router()

router.route("/").get(verifyJwt,showTweet)
 
router.route("/posttweet").post(verifyJwt,sendTweet)
 
router.route("/like").post(verifyJwt,like)

router.route("/unlike").post(verifyJwt,unlike)

router.route("/comment").post(verifyJwt,addComment)

router.route("/:tweetId/comments").get(getComments)

router.route("/:commentid/delete").delete(verifyJwt,deleteComment)

module.exports=router;