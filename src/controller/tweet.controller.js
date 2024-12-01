const Tweet=require('../models/tweet.models.js')
const User=require('../models/user.models.js')
const Like=require("../models/like.models.js")
const mongoose=require("mongoose")

const sendTweet=async(req,res)=>{
    const userId=req.user?._id;
    const {tweet}=req.body;
    if(!userId){
        return res.status(401).json({e:"no userId recieved"})
    }
    if(!tweet){
        return res.status(401).json({e:"tweet field is empty"})
    }
    const user=await User.findById(userId);
    if(!user){
        return res.status(404).json({e:"no user found with this userId"})
    }
    const saveData=new Tweet({
        userid:userId,
        tweet
    })

    await saveData.save()
   
    const tweets = await Tweet.aggregate([
        {
            $match: { userid: new mongoose.Types.ObjectId( userId) }
        },
        {
            $lookup: {
                from: "users", 
                localField: "userid", 
                foreignField: "_id",
                as: "userDetails"
            }
        },
        {
            $unwind: "$userDetails" 
        },
        {
            $project: {
                _id: 0,
                username: "$userDetails.username", 
                tweet: "$tweet" 
            }
        }
    ]);
    res.status(200).json({m:tweets})
}

const showTweet=async(_,res)=>{
   try {
     const tweets = await Tweet.aggregate([
         { 
             $lookup: {
                 from: 'users',
                 localField: 'userid', 
                 foreignField: '_id',
                 as: 'userDetails' 
             }
         },
         {
            $lookup:{
                from:"likes",
                localField:"_id",
                foreignField:"tweetid",
                as:"likes"
            }
         },
         {
            $addFields:{
                likeCount:{$size:"$likes"}
            }
         },
         {$unwind:"$userDetails"},
         { $sample: { size: 10 } } ,
         {
            $project:{
                username:"$userDetails.username",
                tweet:1,
                updatedAt:1,
                likes:"$likeCount"
            }
         }
     ]);
     
     if (tweets.length === 0) {
         return res.status(200).json({ m: "No tweets to show now, come back later" });
     }
     res.status(200).json({tweets})
   } catch (error) {
    res.status(500).json({e:"Some internal error occured"})
   }
}

const like=async(req,res)=>{
    const {tweetId}=req.body;
    const userId=req.user?._id;
    if(!tweetId){
        return res.status(400).json({e:"no tweetId provided"})
    }
    try {
        const alreadyLiked= await Like.findOne({tweetid:tweetId,userid:userId})
        if(alreadyLiked){
            return res.status(200).json({m:"Already Liked"})
        }
        const like = new Like({
            userid:userId,
            tweetid:tweetId
        })
        await like.save()   
        res.status(200).json({m:"liked"}) 
    } catch (error) {
        return res.status(500).json({e:"Internal error Occured"})
    }  
}


const unlike=async(req,res)=>{
    const {tweetId}=req.body;
    const userId=req.user?._id;
    if(!tweetId){
        return res.status(400).json({e:"no tweetId provided"})
    }
    try {
    const likeExists=await Like.findOne({tweetid:tweetId,userid:userId})
    if(!likeExists){
        return res.status(200).json({m:"Already Unliked"})
    }
    await Like.deleteOne({_id:likeExists._id})
    return res.status(200).json({m:"Unliked"})
} catch (error) {
    return res.status(500).json({e:"Internal error Occured"})
}
}

module.exports={sendTweet,showTweet,like,unlike};