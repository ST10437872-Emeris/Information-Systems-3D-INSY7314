const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const User=require('../models/userModel');
const config=require('../config/config');
function tokenFor(user){return jwt.sign({},config.jwtSecret,{subject:String(user._id),issuer:'hustlehubplus-api',expiresIn:config.jwtExpiresIn,algorithm:'HS256'});}
async function register(req,res){
 const {name,email,password,role='Client'}=req.body;
 const existing=await User.exists({email});
 if(existing) return res.status(409).json({message:'Email already registered'});
 // (OWASP Foundation, s.a.) Passwords are salted and hashed rather than stored in plain text.
 const user=await User.create({name,email,passwordHash:await bcrypt.hash(password,12),role});
 return res.status(201).json({user:user.toPublic(),token:tokenFor(user)});
}
async function login(req,res){
 const user=await User.findOne({email:req.body.email});
 if(!user||!(await bcrypt.compare(req.body.password,user.passwordHash)))return res.status(401).json({message:'Invalid email or password'});
 return res.json({user:user.toPublic(),token:tokenFor(user)});
}
async function me(req,res){res.json({user:req.user.toPublic()});}
module.exports={register,login,me};
/* Reference List:
OWASP Foundation. s.a. Password Storage Cheat Sheet. [online] Available at: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html [Accessed 12 October 2026].
*/
