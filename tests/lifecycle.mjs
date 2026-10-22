import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function fixture(failAt=0){
 const queue=[],live=new Set();let attaches=0,timers=0;
 const nil={isNull:()=>true},constants={isNull:()=>false,toString:()=> 'constants'};
 const R={arg:{},runOnMainThreadOnce:fn=>new Promise((resolve,reject)=>queue.push(()=>{try{resolve(fn());}catch(e){reject(e);}})),
  findClass:x=>x,findMethod:(t,m)=>({readPointer:()=>t+'.'+m}),findBound:()=>({}),readRef:(o,n)=>n==='_gameConstants'?constants:nil,
  allClasses:()=>[{name:'PurchaseController+<PingURLCheck>d__60',klass:'ping'}],retain:()=>1,release(){},
  readValue:()=>constants.timeout??2,writeValue:(o,n,k,v)=>{constants.timeout=v;}};
 const ctx=vm.createContext({RuntimeApi:R,SceneApi:{all:()=>[]},rpc:{exports:{}},NativeSignals:{on(){return ()=>{};}},readBattleStatus:()=>({}),
  Process:{id:1},send(){},setInterval(){timers++;return 1;},clearInterval(){timers--;},
  Interceptor:{flush(){},attach(a){attaches++;if(attaches===failAt)throw Error('attach failed');live.add(a);return {detach(){live.delete(a);}};}}});

 return {ctx,live,queue,get timers(){return timers;},async tick(){for(let i=0;i<24;i++){while(queue.length)queue.shift()();await Promise.resolve();}}};
}

const payload=JSON.parse(fs.readFileSync(0,'utf8'));
const registry=fs.readFileSync(new URL('../../bluemilk-editor/sdk/mod_runtime.js',import.meta.url),'utf8');
const f=fixture();vm.runInContext(registry,f.ctx);
const mods=f.ctx.BlueMilkMods;
mods.registerPackage(payload.manifest,payload.source,payload.sha256);
assert.equal(f.live.size,0);assert.equal(f.queue.length,0);
for(let n=0;n<2;n++){
 const enabling=mods.command('enable',{id:payload.manifest.id});
 await f.tick();assert.equal((await enabling).state,'enabled');assert.equal(f.live.size,10);
 const disabling=mods.command('disable',{id:payload.manifest.id});
 await f.tick();assert.equal((await disabling).state,'disabled');assert.equal(f.live.size,0);
 assert.equal(f.timers,0);
}
// Capability checks happen before allocating UI hooks.
const c=fixture();vm.runInContext(registry,c.ctx);
c.ctx.BlueMilkMods.registerPackage({...payload.manifest,capabilities:[]},payload.source,'c'.repeat(64));
await assert.rejects(c.ctx.BlueMilkMods.command('enable',{id:payload.manifest.id}),/Missing capability/);
assert.equal(c.queue.length,0);assert.equal(c.live.size,0);
console.log('PASS Pro-owned UI: two enable/disable cycles, declared capabilities, no embedded Editor provider');
