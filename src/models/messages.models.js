const mongoose=require("mongoose");

const conversationSchema=new mongoose.Schema({
    participants:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ]
},
{
    timestamps:true
}
)

const Conversation=mongoose.model("Conversation",conversationSchema)


const messageSchema=new mongoose.Schema({
    conversationid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Conversation"
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    text:{
        type:String,
        required:true
    }
},
{timestamps:true})

const Message=mongoose.model("Message",messageSchema)


module.exports={Conversation,Message}