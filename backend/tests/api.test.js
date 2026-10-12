const {test,afterEach}=require('node:test');
const assert=require('node:assert/strict');
const {mock}=require('node:test');
const request=require('supertest');
const jwt=require('jsonwebtoken');
const config=require('../src/config/config');
const User=require('../src/models/userModel');
const Gig=require('../src/models/gigModel');
const app=require('../src/app');
// Test-only signing secret; no real credentials or MongoDB installation needed for these mocked route tests.
config.jwtSecret='test-signing-key-for-isolated-node-tests-only-2026';
process.env.JWT_SECRET=config.jwtSecret;
const user=(role,id='66b000000000000000000001')=>({_id:id,role,name:'Test User',email:'test@example.test',toPublic(){return{id,name:this.name,email:this.email,role:this.role}}});
const token=(role)=>jwt.sign({},config.jwtSecret,{subject:'66b000000000000000000001',issuer:'hustlehubplus-api',algorithm:'HS256',expiresIn:'1h'});
function actAs(role){mock.method(User,'findById',async()=>user(role));return `Bearer ${token(role)}`;}
afterEach(()=>mock.restoreAll());
test('health check is reachable and headers are set',async()=>{const r=await request(app).get('/api/health');assert.equal(r.status,200);assert.equal(r.body.status,'ok');assert.equal(r.headers['x-content-type-options'],'nosniff');assert.ok(r.headers['content-security-policy']);});
test('register rejects weak passwords without querying database',async()=>{const r=await request(app).post('/api/auth/register').send({name:'Demo User',email:'demo@example.test',password:'weak',role:'Client'});assert.equal(r.status,400);assert.equal(r.body.message,'Validation failed');});
test('public registration rejects administrator role',async()=>{const r=await request(app).post('/api/auth/register').send({name:'Admin User',email:'admin@example.test',password:'GreatPass!123',role:'Admin'});assert.equal(r.status,400);});
test('missing bearer token is rejected',async()=>{const r=await request(app).post('/api/gigs').send({});assert.equal(r.status,401);});
test('tampered bearer token is rejected',async()=>{const r=await request(app).get('/api/auth/me').set('Authorization','Bearer invalid.jwt.token');assert.equal(r.status,401);});
test('client cannot create gig',async()=>{const bearer=actAs('Client');const r=await request(app).post('/api/gigs').set('Authorization',bearer).send({title:'Cool design',description:'Professional custom work',category:'Design',price:200});assert.equal(r.status,403);});
test('freelancer cannot make client booking',async()=>{const bearer=actAs('Freelancer');const r=await request(app).post('/api/bookings').set('Authorization',bearer).send({gigId:'66b000000000000000000002'});assert.equal(r.status,403);});
test('client booking rejects malformed gig id',async()=>{const bearer=actAs('Client');const r=await request(app).post('/api/bookings').set('Authorization',bearer).send({gigId:'bad'});assert.equal(r.status,400);});
test('freelancer gig rejects negative price and markup',async()=>{const bearer=actAs('Freelancer');const r=await request(app).post('/api/gigs').set('Authorization',bearer).send({title:'<script>',description:'Professional custom work',category:'Design',price:-30});assert.equal(r.status,400);});
test('freelancer cannot update an unowned gig',async()=>{const bearer=actAs('Freelancer');const ownedQuery=mock.method(Gig,'findOneAndUpdate',async(filter)=>{assert.equal(String(filter.freelancer),'66b000000000000000000001');return null;});const r=await request(app).put('/api/gigs/66b000000000000000000002').set('Authorization',bearer).send({title:'Updated gig'});assert.equal(r.status,404);assert.equal(ownedQuery.mock.callCount(),1);});
test('client cannot access admin summary',async()=>{const bearer=actAs('Client');const r=await request(app).get('/api/admin/summary').set('Authorization',bearer);assert.equal(r.status,403);});
test('unknown route returns JSON 404',async()=>{const r=await request(app).get('/api/no-such-route');assert.equal(r.status,404);});
/* Reference List:
Node.js. s.a. Test runner. [online] Available at: https://nodejs.org/api/test.html [Accessed 12 October 2026].
OWASP Foundation. s.a. Authorization Cheat Sheet. [online] Available at: https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html [Accessed 12 October 2026].
*/
