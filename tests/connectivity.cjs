const assert=require('node:assert/strict');
const install=require('../mod/ea-connectivity');
(async()=>{
 const object=(key,timeout)=>({key,timeout,isNull:()=>false,toString:()=>key});
 const first=object('login-config',2),second=object('refreshed-config',2);
 let selected=first,replaced=false,continuations=0,retains=0,releases=0,observer,bindingReady=true;
 const address={};
 const R={runOnMainThreadOnce:async f=>f(),findBound:()=>{if(!bindingReady)throw Error('PurchaseController is not bound during login');return {};},
  readValue:o=>o.timeout,writeValue:(o,n,k,v)=>{o.timeout=v;},
  allClasses:()=>[{name:'PurchaseController+<PingURLCheck>d__60',klass:{}}],
  findMethod:()=>({readPointer:()=>address}),classOf:()=>({}),invoke:()=>continuations++,
  retain:o=>{retains++;return o;},release:()=>{releases++;},
  readRef:(o,n)=>n==='_gameConstants'?selected:n==='<>4__this'?{}:object('continuation',0)};
 let replacement;
 global.NativeCallback=function(fn){return fn;};global.send=()=>{};
 global.Interceptor={attach:(p,handlers)=>{assert.equal(p,address);observer=handlers;return {detach(){observer=null;}};},
  replace:(p,fn)=>{assert.equal(p,address);replaced=true;replacement=fn;},
  revert:p=>{assert.equal(p,address);replaced=false;},flush(){}};
 const fix=install({native:{runtime:R}},true);await fix.ready;assert.equal(first.timeout,15);
 // The exact user regression: login replaces the config. Status must reveal
 // the live 2-second value without writing from a read-only query.
 selected=second;assert.equal((await fix.inspect()).timeoutSeconds,2);assert.equal(second.timeout,2);
 observer.onEnter([{}]);assert.equal(second.timeout,15);assert.equal(first.timeout,15);
 assert.equal((await fix.inspect()).timeoutSeconds,15);
 await fix.setEnabled(false);assert.equal(first.timeout,2);assert.equal(second.timeout,2);assert.equal(observer,null);
 assert.equal(replaced,false);assert.equal(continuations,0);assert.equal(fix.status().enabled,false);
 await fix.setEnabled(true);assert.equal(second.timeout,15);assert.equal(fix.status().enabled,true);
 await assert.rejects(fix.setEnabled('skip'),/Expected boolean/);assert.equal(second.timeout,15);
 second.timeout=7;await fix.stop();assert.equal(second.timeout,7);assert.equal(fix.status().lifecycle,'stopped');
 assert.equal(observer,null);assert.equal(retains,releases);
 bindingReady=false;
 const early=install({native:{runtime:R}},true);await early.ready;
 assert.equal(early.status().configurationReady,false);assert.equal(early.status().timeoutSeconds,null);
 bindingReady=true;second.timeout=2;observer.onEnter([{}]);
 assert.equal((await early.inspect()).timeoutSeconds,15);await early.stop();assert.equal(second.timeout,2);
 console.log('PASS EA preflight: refreshed purchase config, truthful status, native entry rebinding, fixed boolean toggle, ownership and cleanup');
})().catch(e=>{console.error(e);process.exitCode=1;});
