import mongoose from "mongoose";
import bcrypt from "bcrypt";
import  Jwt from "jsonwebtoken";
import crypto from "crypto";
const  userSchema= new mongoose.Schema({

  avatar:{
    type:{
        url:String,
        localPath:String,
    },
    default:{
        url:`https://placehold.co/200x200`,
        localPath:""
    }
  },
  username:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true,
    index:true
  },
  email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true,
  },
  fullName:{
    type:String,
    trim:true
  },
  password:{
    type:String,
    required:[true,"Password is required"]
  },
  isEmailVerfied:{
    type:Boolean,
    default:false
  },
  refreshToken:{
    type:String,
  },
  forgotPasswordToken:{
    type:String,
  },
  forgotPasswordExpiry:{
    type:Date,
  },
  emailVerficationToken:{
    type:String,
  },
  emailVerficationExpiry:{
    type:Date,
  },
},{timestamps:true})


userSchema.pre("save",async function () {
    if(!this.isModified("password")) return ;
    
    
      this.password = await bcrypt.hash(this.password, 10);  
    
  
})

userSchema.methods.isPasswordCorrect = async function(password){
   return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function(){
 return Jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
  );
}
userSchema.methods.generateRefreshToken = function () {
  return Jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY },
  );
};
userSchema.methods.generateTemporaryToken = function(){
 const unHasedToken =  crypto.randomBytes(20).toString("hex")
 const hasedToken = crypto
            .createHash("sha256")
            .update(unHasedToken)
            .digest("hex")

 const TokenExpiry = Date.now() + (20*60*1000)
 return {unHasedToken,hasedToken,TokenExpiry}
}
const UserModel = mongoose.model("user",userSchema);
export default UserModel;