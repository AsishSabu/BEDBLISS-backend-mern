import mongoose from "mongoose";
const otpModel=new mongoose.Schema({
    otp:{
        type:String
    },
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
   },
    { timestamps:true}
)
otpModel.index({createdAt:1},{expireAfterSeconds:120})
export default mongoose.model("OTP",otpModel);
