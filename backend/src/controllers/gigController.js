const mongoose=require('mongoose');
const Gig=require('../models/gigModel');
const okId=id=>mongoose.isValidObjectId(id);
async function listGigs(req,res){
 const search=String(req.query.search||'').trim().slice(0,100);
 const category=String(req.query.category||'').trim().slice(0,80);
 const filter={active:true};
 if(search)filter.$or=[{title:{$regex:escapeRegExp(search),$options:'i'}},{description:{$regex:escapeRegExp(search),$options:'i'}}];
 if(category)filter.category=category;
 const gigs=await Gig.find(filter).populate('freelancer','name role').sort({createdAt:-1}).limit(100);
 res.json(gigs);
}
const escapeRegExp=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
async function getGig(req,res){
 if(!okId(req.params.id))return res.status(400).json({message:'Invalid gig id'});
 const gig=await Gig.findOne({_id:req.params.id,active:true}).populate('freelancer','name role');
 if(!gig)return res.status(404).json({message:'Gig not found'});
 res.json(gig);
}
async function mine(req,res){res.json(await Gig.find({freelancer:req.user._id}).sort({createdAt:-1}));}
async function createGig(req,res){
 const {title,description,category,price}=req.body;
 const gig=await Gig.create({title,description,category,price,freelancer:req.user._id});
 res.status(201).json(gig);
}
async function updateGig(req,res){
 if(!okId(req.params.id))return res.status(400).json({message:'Invalid gig id'});
 const fields=['title','description','category','price','active'];
 const updates=Object.fromEntries(Object.entries(req.body).filter(([key])=>fields.includes(key)));
 // (OWASP Foundation, s.a.) Ownership is checked in the MongoDB query itself.
 const gig=await Gig.findOneAndUpdate({_id:req.params.id,freelancer:req.user._id},{$set:updates},{new:true,runValidators:true});
 if(!gig)return res.status(404).json({message:'Gig not found'});
 res.json(gig);
}
async function deleteGig(req,res){
 if(!okId(req.params.id))return res.status(400).json({message:'Invalid gig id'});
 const gig=await Gig.findOneAndUpdate({_id:req.params.id,freelancer:req.user._id},{$set:{active:false}},{new:true});
 if(!gig)return res.status(404).json({message:'Gig not found'});
 res.json({message:'Gig removed from marketplace',gig});
}
module.exports={listGigs,getGig,mine,createGig,updateGig,deleteGig};
/* Reference List:
OWASP Foundation. s.a. Authorization Cheat Sheet. [online] Available at: https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html [Accessed 12 October 2026].
*/
