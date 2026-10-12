const {body,validationResult}=require('express-validator');
function validate(req,res,next){
 const errors=validationResult(req);
 if(!errors.isEmpty()) return res.status(400).json({message:'Validation failed',errors:errors.array({onlyFirstError:true}).map(e=>({field:e.path,message:e.msg}))});
 next();
}
const cleanText=(field,min,max,optional=false)=>{
 let chain=body(field);
 if(optional)chain=chain.optional();
 return chain.isString().withMessage('Must be text').trim().isLength({min,max}).withMessage(`Must be ${min}-${max} characters`).custom(v=>!/[<>]/.test(v)).withMessage('HTML markup is not allowed');
};
const registration=[
 cleanText('name',2,80),
 body('email').isEmail().withMessage('Enter a valid email').normalizeEmail(),
 body('password').isString().isLength({min:8,max:72}).withMessage('Password must be 8-72 characters').matches(/[a-z]/).matches(/[A-Z]/).matches(/[0-9]/).matches(/[^A-Za-z0-9]/).withMessage('Use uppercase, lowercase, number and symbol'),
 body('role').optional().isIn(['Client','Freelancer']).withMessage('Choose Client or Freelancer'),validate
];
const login=[body('email').isEmail().normalizeEmail(),body('password').isString().notEmpty(),validate];
const gigCreate=[cleanText('title',3,120),cleanText('description',10,2000),cleanText('category',2,80),body('price').isFloat({min:1,max:1000000}).withMessage('Price must be between R1 and R1 000 000').toFloat(),validate];
const gigUpdate=[cleanText('title',3,120,true),cleanText('description',10,2000,true),cleanText('category',2,80,true),body('price').optional().isFloat({min:1,max:1000000}).toFloat(),body('active').optional().isBoolean().toBoolean(),body().custom(obj=>obj&&typeof obj==='object'&&Object.keys(obj).some(k=>['title','description','category','price','active'].includes(k))).withMessage('No fields to update'),validate];
const bookingCreate=[body('gigId').isMongoId().withMessage('Valid gigId required'),validate];
module.exports={registration,login,gigCreate,gigUpdate,bookingCreate,validate};
/* Reference List:
Express-validator. s.a. Validation Chain API. [online] Available at: https://express-validator.github.io/docs/api/validation-chain/ [Accessed 12 October 2026].
OWASP Foundation. s.a. Input Validation Cheat Sheet. [online] Available at: https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html [Accessed 12 October 2026].
*/
