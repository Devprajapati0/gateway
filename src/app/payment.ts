import mongoose ,{Schema,} from "mongoose";


const PaymentSchema:Schema =new Schema({
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
   amount:{
       type:Number,
       required:true,
       default:0,
   },
   stripepaymnetid:{
       type:String,
       required:true,
   },
})

export const Payment = mongoose.models.Payment ||  mongoose.model('Payment',PaymentSchema)