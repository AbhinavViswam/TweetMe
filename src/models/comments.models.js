const mongoose= require("mongoose")

const commentSchema=new mongoose.Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    tweetid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Tweet",
        required:true
    },
    comment:{
        type:String
    }
}
,{
    timestamps:true
})

const Comment=mongoose.model("Comment",commentSchema)
module.exports=Comment