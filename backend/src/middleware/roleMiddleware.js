// (OWASP Foundation, s.a.) Deny by default and authorize every restricted endpoint.
module.exports=function requireRole(...roles){return (req,res,next)=>{
 if(!req.user) return res.status(401).json({message:'Authentication required'});
 if(!roles.includes(req.user.role)) return res.status(403).json({message:'Insufficient permissions'});
 next();
}};
/* Reference List:
OWASP Foundation. s.a. Authorization Cheat Sheet. [online] Available at: https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html [Accessed 12 October 2026].
*/
