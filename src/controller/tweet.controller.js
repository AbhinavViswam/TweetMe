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
    console.log(tweets);
    res.status(200).json({m:tweetsResult})
}

module.exports=sendTweet;
