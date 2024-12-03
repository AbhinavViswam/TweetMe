const express=require("express")
const { registerUser, loginUser,logoutUser,changeCurrentPassword,updateUserDetails,updateUsername,showUser,follow,forgotPassword,resetPassword} = require("../controller/user.controller")
const verifyJwt=require("../middleware/verifyToken.middleware.js")
const router=express.Router()

router.route("/register").post(registerUser)

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJwt,logoutUser)

router.route("/:username").get(showUser)

router.route("/change-username").patch(verifyJwt,updateUsername)

router.route("/updatedetails").patch(verifyJwt,updateUserDetails);

router.route("/change-password").post(verifyJwt,changeCurrentPassword)

router.route("/follow").post(verifyJwt,follow)

router.route("/forgot-password").post(forgotPassword)

router.route("/reset-password/:token").patch(resetPassword)

module.exports=router