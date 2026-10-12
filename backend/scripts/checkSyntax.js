const fs=require('node:fs');const path=require('node:path');const cp=require('node:child_process');
let failed=false;
function scan(dir){for(const ent of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,ent.name);if(ent.isDirectory())scan(f);else if(f.endsWith('.js')){const r=cp.spawnSync(process.execPath,['--check',f],{stdio:'inherit'});if(r.status!==0)failed=true;}}}
scan(path.join(__dirname,'../src'));scan(path.join(__dirname,'../tests'));
if(failed)process.exitCode=1;else console.log('All backend JavaScript syntax checks passed.');
