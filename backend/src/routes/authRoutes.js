const router=require('express').Router();
const auth=require('../middleware/authMiddleware');
const v=require('../middleware/validationMiddleware');
const c=require('../controllers/authController');
router.post('/register',v.registration,c.register);
router.post('/login',v.login,c.login);
router.get('/me',auth,c.me);
module.exports=router;
