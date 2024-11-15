const mongoose=require('mongoose');
const {v4:uuidv4, stringify}=require("uuid")
const User=require('./user.models.js')

const tweetSchema=new mongoose.Schema({
    _id:{
        type:String,
        default:uuidv4
    },
    username:{
        type:String,
        ref:'User',
        required:true
    },
    tweet:{
        type:String,
        required:true,
        trim:true
    }
},{timestamps:true})

const Tweet=mongoose.model('Tweet',tweetSchema)
module.exports=Tweet;