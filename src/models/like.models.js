const mongoose=require("mongoose");

const likeSchema= new mongoose.Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    tweetid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Tweet",
        required:true
    }
},
{timestamps:true})

const Like=mongoose.model("Like",likeSchema);
module.exports=Like