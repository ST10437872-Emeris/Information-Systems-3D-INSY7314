const app=require('./app');
const config=require('./config/config');
const connectDatabase=require('./config/database');
async function start() {
  try {
    config.validateConfig();
    await connectDatabase();
    app.listen(config.port,()=>console.log(`API running: http://localhost:${config.port}`));
  }catch(error){console.error('Startup failed:',error.message);process.exitCode=1;}
}
if(require.main===module) start();
module.exports={start};
