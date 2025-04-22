
import mongoose ,{Schema,} from "mongoose";


const userSchema:Schema =new Schema({
   email:{
       type:String,
       required:true,
       unique:true,
       trim:true,
       lowercase:true,
   },
   name:{
       type:String,
       required:true,
       trim:true,
       lowercase:true,
   },
   cusomerid:{
       type:String,
   },
   priceid:{
         type:String,
   },
   status:{
       type:String,
       enum:["active","inactive"],
         default:"inactive",
    },
})

export const User = mongoose.models.User ||  mongoose.model('User',userSchema)