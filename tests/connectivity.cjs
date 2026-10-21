const assert=require('node:assert/strict');
const install=require('../mod/ea-connectivity');
(async()=>{
 let timeout=2,replaced=false,continuations=0;
 const address={};const nil={isNull:()=>false};
 const R={runOnMainThreadOnce:async f=>f(),findBound:()=>({}),readValue:()=>timeout,
  writeValue:(o,n,k,v)=>{timeout=v;},allClasses:()=>[{name:'PurchaseController+<PingURLCheck>d__60',klass:{}}],
  findMethod:()=>({readPointer:()=>address}),readRef:()=>nil,classOf:()=>({}),invoke:()=>continuations++};
 let replacement;
 global.NativeCallback=function(fn){return fn;};global.send=()=>{};
 global.Interceptor={replace:(p,fn)=>{assert.equal(p,address);replaced=true;replacement=fn;},revert:p=>{assert.equal(p,address);replaced=false;},flush(){}};
 const fix=install({native:{runtime:R,scene:{}}},'extended');await fix.ready;assert.equal(timeout,15);
 await fix.setMode('skip');assert.equal(timeout,2);assert.equal(replaced,true);
 assert.equal(replacement({}),0);assert.equal(continuations,1);assert.equal(fix.status().checksSkipped,1);
 await fix.setMode('extended');assert.equal(replaced,false);assert.equal(timeout,15);
 await assert.rejects(fix.setMode('made-up'),/Unknown/);assert.equal(timeout,15);
 await fix.stop();assert.equal(timeout,2);assert.equal(fix.status().lifecycle,'stopped');
 console.log('PASS EA preflight: extend, local-only skip continuation, switch, rejection and exact restoration');
})().catch(e=>{console.error(e);process.exitCode=1;});
