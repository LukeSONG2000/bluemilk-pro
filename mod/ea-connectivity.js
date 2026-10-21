'use strict';
// Only the optional website connectivity preflight. Transactions and receipts
// continue through the original EADP purchase flow without alteration.
module.exports = (sdk, initialMode = 'extended') => {
 const R=sdk.native.runtime,S=sdk.native.scene;
 let mode='original',lifecycle='installing',constants=null,originalTimeout=null,replacement=null,callback=null;
 let checksSkipped=0,lastError=null;
 const valid=value=>['original','extended','skip'].includes(value);
 const status=()=>({lifecycle,mode,timeoutSeconds:mode==='extended'?15:originalTimeout,
  checksSkipped,lastError,scope:'website-preflight-only'});
 function restore(){
  if(replacement){Interceptor.revert(replacement);Interceptor.flush();replacement=null;callback=null;}
  if(constants&&originalTimeout!==null){
   // Another owner changing the constant takes precedence over our cleanup.
   if(R.readValue(constants,'PcConnectivityCheckTimeOutSeconds','i32')===15)
    R.writeValue(constants,'PcConnectivityCheckTimeOutSeconds','i32',originalTimeout);
  }
 }
 async function setMode(value){
  if(!valid(value))throw Error('Unknown connectivity mode');
  if(lifecycle==='stopped')throw Error('Connectivity resource stopped');
  return R.runOnMainThreadOnce(()=>{
   restore();mode='original';
   if(!constants){constants=R.findBound('GameConstants');originalTimeout=R.readValue(constants,'PcConnectivityCheckTimeOutSeconds','i32');}
   if(value==='extended')R.writeValue(constants,'PcConnectivityCheckTimeOutSeconds','i32',15);
   if(value==='skip'){
    const types=R.allClasses().filter(t=>t.name.startsWith('PurchaseController+')&&t.name.includes('PingURLCheck'));
    if(types.length!==1)throw Error('Original website preflight coroutine must resolve uniquely');
    const address=R.findMethod(types[0].klass,'MoveNext',0).readPointer();
    callback=new NativeCallback(function(self){
     try {
      const available=R.readRef(self,'connectionAvailableCallback');
      if(available.isNull())throw Error('Original connectivity continuation missing');
      R.invoke(R.findMethod(R.classOf(available),'Invoke',0),available);
      checksSkipped++;
     }catch(error){lastError=String(error);send({kind:'pro-connectivity-error',error:lastError});}
     return 0;
    },'bool',['pointer','pointer']);
    Interceptor.replace(address,callback);replacement=address;Interceptor.flush();
   }
   mode=value;lifecycle='enabled';return status();
  });
 }
 const ready=setMode(initialMode).catch(error=>{lastError=String(error);lifecycle='failed';throw error;});
 return {ready,status,setMode,async stop(){
  if(lifecycle==='stopped')return status();
  return R.runOnMainThreadOnce(()=>{restore();lifecycle='stopped';mode='original';return status();});
 }};
};
