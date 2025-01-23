const {Conversation,Message}=require("../models/messages.models.js")
const User=require("../models/user.models.js")
const mongoose=require("mongoose")

const createConversation=async(req,res)=>{
    const userid=req.user._id;
    const {recepient}=req.body
    if(!recepient){
        return res.status(400).json({e:"All fields are required"})
    }
    try {
        const user=await User.findById(recepient)
        if(!user){
            return res.status(404).json({e:"User not found"})
        }
        const conversation=await Conversation.findOne({participants:{$all:[userid,recepient]}})
        if(!conversation){
            await Conversation.create({
                participants:[userid,recepient]
            })
            return res.status(200).json({m:"conversation created"})
        }
        return res.status(200).json({m:"conversation already exists"})
    } catch (error) {
        return res.status(500).json({e:"Internal error"})
    }
}

const allConversations=async(req,res)=>{
    const userid=req.user._id
    try {
        const conversations=await Conversation.aggregate([
            {
                $match: {
                    participants: userid
                }
            },
            {
                $lookup:{
                    from:"users",
                    localField:"participants",
                    foreignField:"_id",
                    as:"userDetails"
                }
            },
            {
                $addFields:{
                    otherParticipants:{
                        $filter:{
                            input:"$userDetails",
                            as:"user",
                            cond: { $ne: ["$$user._id", userid] }
                        }
                    }
                }
            },
            {
                
                $unwind: "$otherParticipants"
            },
            {
              
                $project: {
                    "username": "$otherParticipants.username",
                    "fullname": "$otherParticipants.fullname",
                    "profilePicture": "$otherParticipants.profilePicture",
                    // participants: 1
                    _id:1
                }
            }
        ])
        return res.status(200).json({m:"fetched",o:conversations})
    } catch (error) {
        return res.status(500).json({e:"internal error occurred"})
    }
}

const sendMessage=async(req,res)=>{
    const Sender=req.user._id
    const {conversationId}=req.params
    const {Text}=req.body
    if(!Text){
        return res.status(400).json({m:"All fields are required"})
    }
   try {
     const converationExists=await Conversation.findById(conversationId)
     if(!converationExists){
         return res.status(404).json({e:"Conversation does not exist"})
     }
     const message=await Message.create({
         conversationid:conversationId,
         sender:Sender,
         text:Text
     })
     return res.status(200).json({m:"Message sent"})
   } catch (error) {
    return res.status(500).json({e:"Internal error"})
   }
}

const getMessage=async(req,res)=>{
    const {conversationid}=req.params
    try {
        const message=await Message.aggregate([
            {
                $match:{
                    conversationid:new mongoose.Types.ObjectId(conversationid)
                }
            },
            {
                $lookup:{
                    from:"users",
                    localField:"sender",
                    foreignField:"_id",
                    as:"userDetails"
                }
            },
            { $unwind:"$userDetails" },
            {
                $project:{
                    _id:0,
                    sender:"$userDetails.username",
                    text:1,
                    createdAt:1
                }
            }
        ])
        return res.status(200).json({m:"messages",o:message})
    } catch (error) {
        return res.status(500).json({e:"Internal error"})
    }
}

module.exports={createConversation,sendMessage,getMessage, allConversations}
