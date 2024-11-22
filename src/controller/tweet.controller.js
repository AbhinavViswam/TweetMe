const Tweet=require('../models/tweet.models.js')
const User=require('../models/user.models.js')
const mongoose=require("mongoose")

const sendTweet=async(req,res)=>{
    const {userId}=req.params;
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
         { $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true } },
         { $sample: { size: 10 } } 
     ]);
     
     if (tweets.length === 0) {
         return res.status(200).json({ m: "No tweets to show now, come back later" });
     }
     const tweetsResult=tweets.map(t=>({
         username:t.userDetails.username,
         tweets:t.tweet,
         PostedOn:t.createdAt
     }))
     res.status(200).json({tweetsResult})
   } catch (error) {
    res.status(500).json({e:"Some internal error occured"})
   }
}

module.exports={sendTweet,showTweet};