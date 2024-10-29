const mongoose=require('mongoose')
const bcrypt=require('bcrypt')

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
        unique:true,
        default:""
    },
    bio:{
        type:String,
        default:""
    },
    dob:{
        type:String,
        default:""
    }
})

userSchema.pre('save',async function(next){
    if(this.isModified('password')){
        this.password=await bcrypt.hash(this.password,10)
        next();
    }
    else{
        return next();
    }
})

const User = mongoose.model("User",userSchema)

module.exports=User;