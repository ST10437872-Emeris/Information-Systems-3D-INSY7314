const router=require('express').Router();
const auth=require('../middleware/authMiddleware');
const role=require('../middleware/roleMiddleware');
const User=require('../models/userModel');
const Gig=require('../models/gigModel');
const Booking=require('../models/bookingModel');
const Transaction=require('../models/transactionModel');
router.use(auth,role('Admin'));
router.get('/summary',async(req,res)=>{
 const [users,gigs,bookings,transactions]=await Promise.all([User.countDocuments(),Gig.countDocuments({active:true}),Booking.countDocuments(),Transaction.countDocuments()]);
 res.json({users,gigs,bookings,transactions});
});
module.exports=router;
