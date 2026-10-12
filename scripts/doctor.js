// Quick non-destructive diagnostics; reports path and port problems without showing secrets.
const fs = require('node:fs');
const path = require('node:path');
const net = require('node:net');
const root = path.resolve(__dirname, '..');
let problems = 0;
function check(label, valid, help) {
  console.log(`${valid ? 'OK  ' : 'FIX '} ${label}${valid ? '' : ` — ${help}`}`);
  if (!valid) problems++;
}
function exists(rel) { return fs.existsSync(path.join(root, rel)); }
function canConnect(port) {
  return new Promise(resolve => {
    const socket = net.createConnection({host:'127.0.0.1',port,timeout:1200});
    socket.once('connect', () => {socket.destroy(); resolve(true);});
    socket.once('timeout', () => {socket.destroy();resolve(false);});
    socket.once('error', () => resolve(false));
  });
}
async function main() {
  console.log('HustleHubPlus local setup checker');
  console.log('Project root: ' + root);
  const [major,minor] = process.versions.node.split('.').map(Number);
  check('Node.js 20.19+ detected', major>20 || (major===20&&minor>=19), 'Install current Node.js LTS');
  for (const rel of ['backend/src/server.js','backend/src/config/database.js','backend/src/controllers/gigController.js','backend/src/controllers/bookingController.js','backend/src/models/gigModel.js','backend/src/models/bookingModel.js','backend/src/routes/gigRoutes.js','backend/src/routes/bookingRoutes.js','frontend/package.json','frontend/src/App.jsx']) check(rel,exists(rel),'Re-extract this ZIP; do not mix old files');
  check('Backend dependencies installed',exists('backend/node_modules/express'),'Run 01_SETUP_WINDOWS.bat');
  check('Frontend dependencies installed',exists('frontend/node_modules/vite'),'Run 01_SETUP_WINDOWS.bat');
  check('Backend .env configured',exists('backend/.env'),'Run 01_SETUP_WINDOWS.bat');
  check('Frontend .env configured',exists('frontend/.env'),'Run 01_SETUP_WINDOWS.bat');
  if (exists('backend/.env')) {
    const env = fs.readFileSync(path.join(root,'backend','.env'),'utf8');
    const match = env.match(/^JWT_SECRET=(.*)$/m);
    check('JWT secret configured',Boolean(match && match[1].length>=32 && !match[1].includes('REPLACE_')),'Run node scripts/prepare-env.js or update backend/.env');
  }
  check('MongoDB reachable on 127.0.0.1:27017',await canConnect(27017),'Start MongoDB Windows service; use Get-Service MongoDB');
  const apiUp=await canConnect(5000);
  console.log(`${apiUp?'OK  ':'INFO'} Backend port 5000 ${apiUp?'has a process listening':'not listening yet; use 02_START_BACKEND.bat'}`);
  console.log(problems ? `Finished: ${problems} item(s) to fix.` : 'Finished: required files and local MongoDB checks passed.');
  if (problems) process.exitCode=1;
}
main().catch(err=>{console.error(err.message);process.exitCode=1});
