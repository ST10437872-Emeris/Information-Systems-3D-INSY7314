// Local demonstration setup only: protect credentials and do not commit them.
require('dotenv').config();
const bcrypt=require('bcryptjs');
const mongoose=require('mongoose');
const User=require('../src/models/userModel');
const config=require('../src/config/config');
(async()=>{
 try{
  config.validateConfig();
  const email=String(process.env.ADMIN_EMAIL||'').toLowerCase().trim();
  const password=process.env.ADMIN_PASSWORD||'';
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||password.length<12)throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD (12+ characters) in this terminal');
  await mongoose.connect(config.mongoUri);
  if(await User.exists({email}))throw new Error('Email already exists; choose another admin email');
  const user=await User.create({name:'Demo Administrator',email,passwordHash:await bcrypt.hash(password,12),role:'Admin'});
  console.log('Admin created:',user.email);
 }catch(err){console.error('Admin setup failed:',err.message);process.exitCode=1;}finally{await mongoose.disconnect();}
})();
