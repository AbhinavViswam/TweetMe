const User = require('../models/user.models.js')
const bcrypt=require('bcrypt')

const registerUser=async(req,res)=>{
    const {fullname,email,password}=req.body;
    if(!fullname || !email || !password){
        return res.status(400).json({error:"All Fields are required"})
    }
    const user=await User.findOne({email})
    if(user){
        return res.status(409).json({error:"User Already exists"})
    }
    const saveUser=await User.create({
        fullname,
        email,
        password
    })
    if(!saveUser){
        return res.status(500).json({e:"Internal error"})
    }
    res.status(200).json({s:"User registered successfully"})
}


const loginUser=async(req,res)=>{
    const {email,password}=req.body
    if(!email || !password){
        return res.status(400).json({e:"All fields are required"})
    }
    const user=await User.findOne({email});
    if(!user){
        return res.status(404).json({e:`${email} not registered`})
    }
    const passwordIsMatch=await bcrypt.compare(password,user.password);
    if(!passwordIsMatch){
        return res.status(400).json({e:"Incorrect Password"})
    }
    res.status(200).json({m:`Successfully logged in as ${email}`});
}

module.exports={registerUser,loginUser};