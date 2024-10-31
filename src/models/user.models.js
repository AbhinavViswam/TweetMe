const mongoose=require('mongoose')
const bcrypt=require('bcrypt')

const userSchema = mongoose.Schema({
    email : {
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    password : {
        type:String,
        required:true
    },
    fullname:{
        type:String,
        required:true,
        uppercase:true
    },
    username:{
        type:String
    },
    phone:{
        type:Number
    },
    bio:{
        type:String
    },
    dob:{
        type:String
    }
},{
    timestamps:true
})

const User = mongoose.model("User",userSchema)

module.exports=User;