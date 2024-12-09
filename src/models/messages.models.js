const mongoose=require("mongoose");


const groupSchema=new mongoose.Schema({
    members:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    name:{
        type:String,
        required:true
    }
})

const Group=mongoose.model("Group",groupSchema)


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


module.exports={Group,Conversation,Message}