const express=require("express")
const dotenv=require("dotenv")
const path=require("path")
const cookieParser=require("cookie-parser")
const connectDB = require("./db/db.config.js")
const userRouter=require("./routes/user.route.js")
const tweetRouter=require("./routes/tweet.route.js")

const app=express()

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname, 'public')));

dotenv.config()

connectDB()

app.use("/user",userRouter);
app.use("/tweet",tweetRouter);

app.listen(3001 || process.env.PORT,()=>{
    console.log("Server running");
})