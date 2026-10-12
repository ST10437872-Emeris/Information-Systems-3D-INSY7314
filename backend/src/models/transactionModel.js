const mongoose=require('mongoose');
const schema=new mongoose.Schema({
 booking:{type:mongoose.Schema.Types.ObjectId,ref:'Booking',required:true,unique:true},
 client:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,index:true},
 freelancer:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,index:true},
 amount:{type:Number,required:true,min:1},
 currency:{type:String,enum:['ZAR'],default:'ZAR'},
 status:{type:String,enum:['Simulated'],default:'Simulated'}
},{timestamps:true});
module.exports=mongoose.model('Transaction',schema);
