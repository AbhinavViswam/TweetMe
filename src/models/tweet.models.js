const mongoose=require('mongoose');
const User=require('./user.models.js')

const tweetSchema=new mongoose.Schema({
    username:{
        type:mongoose.Schema.Types.ObjectId,
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