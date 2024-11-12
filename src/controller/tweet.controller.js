const Tweet=require('../models/tweet.models.js')
const User=require('../models/user.models.js')

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
        username:userId,
        tweet
    })
    await saveData.save()
    const tweets=await Tweet.find({username:userId}).populate('username')
    const tweetsResult=tweets.map(t=>({
        username:t.username.username,
        tweets:t.tweet
    }))
    res.status(200).json({m:tweetsResult})
}

const showTweet=async(req,res)=>{
    const tweets = await Tweet.aggregate([
        { 
            $lookup: {
                from: 'users',
                localField: 'username', 
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
}

module.exports={sendTweet,showTweet};