const mongoose=require('mongoose');
// (Mongoose, s.a.) Required, range and length constraints also protect direct DB writes.
const gigSchema=new mongoose.Schema({
 title:{type:String,required:true,trim:true,minlength:3,maxlength:120},
 description:{type:String,required:true,trim:true,minlength:10,maxlength:2000},
 category:{type:String,required:true,trim:true,minlength:2,maxlength:80},
 price:{type:Number,required:true,min:1,max:1000000},
 freelancer:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,index:true},
 active:{type:Boolean,default:true,index:true}
},{timestamps:true});
module.exports=mongoose.model('Gig',gigSchema);
/* Reference List:
Mongoose. s.a. Validation. [online] Available at: https://mongoosejs.com/docs/validation.html [Accessed 12 October 2026].
*/
