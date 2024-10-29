const express=require("express")
const dotenv=require("dotenv")
const connectDB = require("./db/db.config")
const userRouter=require("./routes/user.route")

const app=express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

dotenv.config()

connectDB()

app.use("/user",userRouter);

app.listen(3001 || process.env.PORT,()=>{
    console.log("Server running");
})