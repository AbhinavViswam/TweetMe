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
    // const tweets=await Tweet.find({userid:userId}).populate('userid')
    // const tweets1=await Tweet.aggregate([
    //     {$match:{userid:userId}},
    //     {$lookup:{from:"users",localField:"userid",foreignField:"_id", as:"UserDetails"}},
    //     {$unwind:"$UserDetails"},
    //     {$project:{_id:0,username:"$UserDetails.username",tweets:"$tweets"}}
    //     ////samething above but using aggregation
    // ])
    const tweets = await Tweet.aggregate([
        {
            $match: { userid: new mongoose.Types.ObjectId( userId) } // Match tweets by userId
        },
        {
            $lookup: {
                from: "users", // Collection to join with
                localField: "userid", // Field in Tweet to match
                foreignField: "_id", // Field in User to match
                as: "userDetails" // Output array name
            }
        },
        {
            $unwind: "$userDetails" // Flatten the userDetails array
        },
        {
            $project: {
                _id: 0, // Exclude the _id field
                username: "$userDetails.username", // Get username from userDetails
                tweet: "$tweet" // Include the tweet content
            }
        }
    ]);
    console.log(tweets);
    // const tweetsResult=tweets.map(t=>({
    //     username:t.userid.username,
    //     tweets:t.tweet
    // }))
    res.status(200).json({m:tweets})
}

const showTweet=async(_,res)=>{
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
}

module.exports={sendTweet,showTweet};