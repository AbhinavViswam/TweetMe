const express=require("express")
const { registerUser, loginUser,logoutUser,changeCurrentPassword,updateUserDetails,updateUsername,showUser,follow} = require("../controller/user.controller")
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

module.exports=router