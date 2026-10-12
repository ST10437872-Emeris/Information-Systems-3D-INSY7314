const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');
const config = require('./config/config');
const app = express();
app.disable('x-powered-by');
// (Helmet, s.a.; OWASP Foundation, s.a.) Defence-in-depth with CSP and headers.
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'none'"],
      frameAncestors: ["'none'"],
      objectSrc: ["'none'"],
      baseUri: ["'none'"],
      formAction: ["'none'"]
    }
  },
  crossOriginResourcePolicy: { policy: 'same-site' }
}));
app.use(cors({origin: config.clientOrigin.split(',').map(v=>v.trim()), methods:['GET','POST','PUT','DELETE','OPTIONS']}));
app.use(express.json({limit:'32kb', strict:true}));
const loginLimiter=rateLimit({windowMs:15*60*1000, limit:10, standardHeaders:'draft-8', legacyHeaders:false, message:{message:'Too many login attempts. Try again later.'}});
const bookingLimiter=rateLimit({windowMs:15*60*1000, limit:20, standardHeaders:'draft-8', legacyHeaders:false, message:{message:'Too many bookings. Try again later.'}});
app.get('/api/health', (_req,res)=>res.json({status:'ok',service:'HustleHubPlus API'}));
app.use('/api/auth/login',loginLimiter);
app.use('/api/auth',require('./routes/authRoutes'));
app.use('/api/gigs',require('./routes/gigRoutes'));
app.use('/api/bookings',(req,res,next)=>req.method==='POST'?bookingLimiter(req,res,next):next(),require('./routes/bookingRoutes'));
app.use('/api/admin',require('./routes/adminRoutes'));
app.use((req,res)=>res.status(404).json({message:'Route not found'}));
// Express 5 forwards rejected async handlers to this handler (Express.js, s.a.).
app.use((err,req,res,next)=>{
  if(res.headersSent) return next(err);
  if(err.name==='ValidationError') return res.status(400).json({message:'Validation failed',errors:Object.values(err.errors).map(e=>({field:e.path,message:e.message}))});
  if(err.name==='CastError') return res.status(400).json({message:'Invalid identifier'});
  if(err.code===11000) return res.status(409).json({message:'Record already exists'});
  if(err.type==='entity.too.large') return res.status(413).json({message:'Request too large'});
  if(err instanceof SyntaxError && 'body' in err) return res.status(400).json({message:'Invalid JSON request'});
  console.error('Request failed:',err);
  return res.status(500).json({message:'Internal server error'});
});
module.exports=app;
/* Reference List:
Express.js. s.a. Error Handling. [online] Available at: https://expressjs.com/en/guide/error-handling/ [Accessed 12 October 2026].
Helmet. s.a. Helmet.js. [online] Available at: https://helmetjs.github.io/ [Accessed 12 October 2026].
OWASP Foundation. s.a. REST Security Cheat Sheet. [online] Available at: https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html [Accessed 12 October 2026].
*/
