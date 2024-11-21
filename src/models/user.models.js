const mongoose=require('mongoose')

const userSchema = mongoose.Schema({
    email : {
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    password : { 
        type:String,
        required:true
    },
    fullname:{
        type:String,
        required:true,
        uppercase:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:Number,
        default:0
    },
    bio:{
        type:String,
        default:""
    },
    dob:{
        type:String,
        default:""
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:"user"
    }, 
    isBlocked:{
        type:Boolean,
        default:false
    } 
},{
    timestamps:true
})

const User = mongoose.model("User",userSchema)

module.exports=User;