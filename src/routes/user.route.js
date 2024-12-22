const express=require("express")
const passport=require("passport")
const { registerUser, loginUser,logoutUser,changeCurrentPassword,updateUserDetails,updateUsername,showUser,follow,unfollow,forgotPassword,resetPassword,searchUser,googleCallback_Signin} = require("../controller/user.controller")
const verifyJwt=require("../middleware/verifyToken.middleware.js")
const router=express.Router()

router.route("/register").post(registerUser)

router.route("/login").post(loginUser);

router.route("/google").get(passport.authenticate('google', { scope: ['profile', 'email'] }))

router.route("/google/callback")

router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    googleCallback
  );

router.route("/logout").post(verifyJwt,logoutUser)

router.route("/:username").get(showUser)

router.route("/change-username").patch(verifyJwt,updateUsername)

router.route("/updatedetails").patch(verifyJwt,updateUserDetails);

router.route("/change-password").post(verifyJwt,changeCurrentPassword)

router.route("/follow").post(verifyJwt,follow)

router.route("/unfollow").delete(verifyJwt,unfollow)

router.route("/forgot-password").post(forgotPassword)

router.route("/reset-password/:token").patch(resetPassword)

router.route("/search").post(verifyJwt,searchUser)

//message

const {createConversation,sendMessage,getMessage}=require("../controller/message.controller.js")

router.route("/m").post(verifyJwt,createConversation)

router.route("/m/:conversationid").get(verifyJwt,getMessage)

router.route("/m/:conversationId/sent").post(verifyJwt,sendMessage)

module.exports=router