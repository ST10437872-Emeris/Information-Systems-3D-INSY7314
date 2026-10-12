// Generates local-only configuration files; never overwrites existing .env files.
// In-text reference: Node.js (s.a.) recommends cryptographically secure randomBytes.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const backendEnv = path.join(root, 'backend', '.env');
const frontendEnv = path.join(root, 'frontend', '.env');
function prepare(target, example, transform) {
  if (fs.existsSync(target)) {
    console.log(`KEPT existing ${path.relative(root, target)} (not overwritten)`);
    return;
  }
  let template = fs.readFileSync(example, 'utf8');
  if (transform) template = transform(template);
  fs.writeFileSync(target, template, {encoding: 'utf8', flag: 'wx', mode: 0o600});
  console.log(`CREATED ${path.relative(root, target)} (local only)`);
}
prepare(backendEnv, path.join(root, 'backend', '.env.example'), text => {
  const secret = crypto.randomBytes(32).toString('hex');
  if (!text.includes('REPLACE_WITH_YOUR_OWN_RANDOM_SECRET_AT_LEAST_32_CHARACTERS')) {
    throw new Error('JWT_SECRET template is not the expected one');
  }
  return text.replace('REPLACE_WITH_YOUR_OWN_RANDOM_SECRET_AT_LEAST_32_CHARACTERS', secret);
});
prepare(frontendEnv, path.join(root, 'frontend', '.env.example'));
console.log('Environment setup finished. Never upload or commit the .env files.');
/* Reference List:
Node.js. s.a. Crypto. [online] Available at: https://nodejs.org/api/crypto.html [Accessed 12 October 2026].
*/
