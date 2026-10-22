'use strict';
// Only the optional public website preflight; never authentication or receipts.
module.exports=(sdk,initialEnabled=true)=>{
 const R=sdk.native.runtime;
 let enabled=false,lifecycle='installing',observer=null;
 let checksExtended=0,lastError=null,observedTimeout=null;
 const owned=new Map();
 const current=()=>{
  const c=R.readRef(R.findBound('PurchaseController'),'_gameConstants');
  if(c.isNull())throw Error('Current purchase configuration is unavailable');
  return c;
 };
 const read=c=>R.readValue(c,'PcConnectivityCheckTimeOutSeconds','i32');
 const status=()=>({lifecycle,enabled,configuredSeconds:enabled?15:null,configurationReady:observedTimeout!==null,
  timeoutSeconds:observedTimeout,checksExtended,lastError,scope:'website-preflight-only'});
 function apply(c){
  const key=c.toString();
  if(!owned.has(key)){
   if(owned.size>=8)throw Error('Purchase configuration ownership limit reached');
   owned.set(key,{object:c,original:read(c),handle:R.retain(c)});
  }
  R.writeValue(c,'PcConnectivityCheckTimeOutSeconds','i32',15);observedTimeout=read(c);
  if(observedTimeout!==15)throw Error('Purchase timeout did not accept the requested value');
  lastError=null;
 }
 function restore(){
  observer?.detach();observer=null;
  for(const e of owned.values()){
   if(read(e.object)===15)R.writeValue(e.object,'PcConnectivityCheckTimeOutSeconds','i32',e.original);
   R.release(e.handle);
  }
  owned.clear();
 }
 function address(){
  const types=R.allClasses().filter(t=>t.name.startsWith('PurchaseController+')&&t.name.includes('PingURLCheck'));
  if(types.length!==1)throw Error('Original website preflight coroutine must resolve uniquely');
  return R.findMethod(types[0].klass,'MoveNext',0).readPointer();
 }
 async function setEnabled(value){
  if(typeof value!=='boolean')throw Error('Expected boolean value');
  if(lifecycle==='stopped')throw Error('Connectivity resource stopped');
  return R.runOnMainThreadOnce(()=>{
   restore();enabled=false;lastError=null;
   try{
    if(value){
     observer=Interceptor.attach(address(),{onEnter(args){
      try{
       // Login/catalog refresh replaces GameConstants. Resolve the actual
       // coroutine owner on every entry, not the stale login-time binding.
       apply(R.readRef(R.readRef(args[0],'<>4__this'),'_gameConstants'));checksExtended++;
      }catch(error){lastError=String(error);send({kind:'pro-connectivity-error',error:lastError});}
     }});
     let initial=null;
     try{initial=current();}catch(error){lastError=String(error);observedTimeout=null;}
     if(initial)apply(initial); // Early login can precede the purchase binding.
    }
    try{observedTimeout=read(current());}catch{observedTimeout=null;}
    enabled=value;lifecycle='enabled';return status();
   }catch(error){lastError=String(error);restore();lifecycle='failed';throw error;}
  });
 }
 // A read-only status must report the live value, not a number inferred from mode.
 const inspect=()=>R.runOnMainThreadOnce(()=>{try{observedTimeout=read(current());}catch{observedTimeout=null;}return status();});
 const ready=setEnabled(initialEnabled).catch(error=>{lastError=String(error);lifecycle='failed';throw error;});
 return {ready,status,inspect,setEnabled,async stop(){
  if(lifecycle==='stopped')return status();
  return R.runOnMainThreadOnce(()=>{restore();lifecycle='stopped';enabled=false;try{observedTimeout=read(current());}catch{observedTimeout=null;}return status();});
 }};
};
