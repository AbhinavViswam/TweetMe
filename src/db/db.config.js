const mongoose =require('mongoose')

const connectDB = async()=>{
    try {
        const connection = await mongoose.connect(process.env.DB_URI)
        console.log("Database connection successful");
    } catch (error) {
        console.log(error);
    }   
}

module.exports = connectDB;