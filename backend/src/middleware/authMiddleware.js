const jwt=require('jsonwebtoken');
const User=require('../models/userModel');
const config=require('../config/config');
// (OWASP Foundation, s.a.) Verify signature, algorithm, issuer and subject; load current role from DB.
async function authenticate(req,res,next){
  const header=req.get('authorization')||'';
  if(!/^Bearer\s+\S+$/i.test(header)) return res.status(401).json({message:'Authentication required'});
  try{
    const token=header.replace(/^Bearer\s+/i,'');
    const payload=jwt.verify(token,config.jwtSecret,{algorithms:['HS256'],issuer:'hustlehubplus-api'});
    if(!payload.sub) throw new Error('Missing subject');
    const user=await User.findById(payload.sub);
    if(!user) return res.status(401).json({message:'Account no longer available'});
    req.user=user;
    return next();
  }catch(_error){return res.status(401).json({message:'Invalid or expired token'});}
}
module.exports=authenticate;
module.exports.authenticateToken=authenticate;
/* Reference List:
OWASP Foundation. s.a. JSON Web Token for Java Cheat Sheet. [online] Available at: https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html [Accessed 12 October 2026].
*/
