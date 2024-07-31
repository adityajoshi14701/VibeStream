import mongoose ,{Schema} from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
 
const userSchema = new Schema({
        userName:{
           type:String,
           required:true,
           unique:true,
           lowercase:true,
           trim:true,
           index:true,
        },
        email:{
           type:String,
           required:true,
           unique:true,
           lowercase:true,
           trim:true,
        },
        fullname:{
           type:String,
           required:true,
           trim:true,
           index:true,
        },
        avatar:{
           type:String,
           required:true,
        },
        coverImage:{
           type:String,
        },
        watchHistory:[{
           type:Schema.Types.ObjectId,
           ref:"Video"
        }],
        password:{
           type:String,
           required:[true,'Password is required ']
        },
        refreshToken:{
           type:String,
        }
},
{
   timestamps:true,
})
// don't use arrow function in this pre hook as this refrence is not available in it
userSchema.pre("save",async function(next)
{
    if(!this.isModified("password")) return next();
    this.password= await bcrypt.hash(this.password)
    next()   
})
//.methods help us to create custom methods for the schema
userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password)
}


userSchema.methods.generateAccessToken=function(){
return jwt.sign({
    _id:this._id,
    email:this.email,
    name:this.name, 
    fullname:this.fullname
},process.env.ACCESS_TOKEN_SECRET,process.env.ACCESS_TOKEN_EXPIRY)
}

userSchema.methods.generateRefreshToken=function(){
    return jwt.sign({
        _id:this._id,
        email:this.email,
        name:this.name,
        fullname:this.fullname
    },process.env.REFRESH_TOKEN_SCERET,process.env.REFRESH_TOKEN_EXPIRY)
}
export const User = mongoose.model("User",userSchema)