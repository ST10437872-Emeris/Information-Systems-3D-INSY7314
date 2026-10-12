require('dotenv').config();
const config = {
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hustlehubplus',
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '2h',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  nodeEnv: process.env.NODE_ENV || 'development'
};
// (OWASP Foundation, s.a.) No default production signing secret is supplied.
function validateConfig() {
  if (!config.jwtSecret || config.jwtSecret.length < 32 || config.jwtSecret.startsWith('REPLACE_')) {
    throw new Error('Set a unique JWT_SECRET with 32+ characters in backend/.env');
  }
  if (!Number.isInteger(config.port) || config.port < 1 || config.port > 65535) throw new Error('Invalid PORT');
}
module.exports = config;
module.exports.validateConfig = validateConfig;
/* Reference List:
OWASP Foundation. s.a. JSON Web Token for Java Cheat Sheet. [online] Available at: https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html [Accessed 12 October 2026].
*/
