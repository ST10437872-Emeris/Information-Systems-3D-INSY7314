const mongoose=require('mongoose');
const Gig=require('../models/gigModel');
const Booking=require('../models/bookingModel');
const Transaction=require('../models/transactionModel');
function ownerFilter(user){
 if(user.role==='Freelancer')return {freelancer:user._id};
 if(user.role==='Client')return {client:user._id};
 return null;
}
async function createBooking(req,res){
 const gig=await Gig.findOne({_id:req.body.gigId,active:true});
 if(!gig)return res.status(404).json({message:'Gig not available'});
 if(String(gig.freelancer)===String(req.user._id))return res.status(400).json({message:'Cannot book your own gig'});
 // (MongoDB, s.a.) Amount is copied from trusted gig record, never accepted from client.
 const booking=await Booking.create({gig:gig._id,client:req.user._id,freelancer:gig.freelancer,amount:gig.price,status:'Confirmed'});
 try{
  const transaction=await Transaction.create({booking:booking._id,client:req.user._id,freelancer:gig.freelancer,amount:gig.price,currency:'ZAR',status:'Simulated'});
  const populated=await Booking.findById(booking._id).populate('gig','title price category').populate('freelancer','name');
  return res.status(201).json({message:'Booking confirmed (simulated transaction only)',booking:populated,transaction});
 }catch(error){
  await Booking.findByIdAndDelete(booking._id);
  throw error;
 }
}
async function listBookings(req,res){
 const filter=ownerFilter(req.user);
 if(!filter)return res.status(403).json({message:'Insufficient permissions'});
 const result=await Booking.find(filter).populate('gig','title price category').populate('client','name').populate('freelancer','name').sort({createdAt:-1});
 return res.json(result);
}
async function getBooking(req,res){
 if(!mongoose.isValidObjectId(req.params.id))return res.status(400).json({message:'Invalid booking id'});
 const filter=ownerFilter(req.user);
 if(!filter)return res.status(403).json({message:'Insufficient permissions'});
 const item=await Booking.findOne({_id:req.params.id,...filter}).populate('gig','title price category').populate('client','name').populate('freelancer','name');
 if(!item)return res.status(404).json({message:'Booking not found'});
 return res.json(item);
}
async function listTransactions(req,res){
 const filter=ownerFilter(req.user);
 if(!filter)return res.status(403).json({message:'Insufficient permissions'});
 const transactions=await Transaction.find(filter).populate('booking','gig status createdAt').sort({createdAt:-1});
 const result={transactions,currency:'ZAR'};
 if(req.user.role==='Freelancer')result.totalIncome=transactions.reduce((s,t)=>s+t.amount,0);
 return res.json(result);
}
module.exports={createBooking,listBookings,getBooking,listTransactions};
/* Reference List:
MongoDB. s.a. Data Modeling. [online] Available at: https://www.mongodb.com/docs/manual/data-modeling/ [Accessed 12 October 2026].
OWASP Foundation. s.a. Authorization Cheat Sheet. [online] Available at: https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html [Accessed 12 October 2026].
*/
