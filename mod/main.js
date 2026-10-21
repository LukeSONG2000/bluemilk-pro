'use strict';
const install = require('./information-ui');
const attributes = require('./attributes');
const connectivity = require('./ea-connectivity');
module.exports = sdk => {
  let ui=null,lifecycle='enabled',lastStop=null;
  const configuration=sdk.config.read();
  const resource={
    get ready(){return ui?.ready||Promise.resolve();},
    status:()=>({lifecycle,information:!!ui,hud:ui?.status()??null,lastStop}),
    async stop(){
      lifecycle='stopping';
      try {
        if(ui){const result=await ui.stop();lastStop=result;if(result.lifecycle!=='stopped')throw Error('Pro UI cleanup was not confirmed');ui=null;}
        lifecycle='stopped';return {lifecycle};
      } catch(error){lifecycle='cleanup-failed';throw error;}
    }
  };
  sdk.lifecycle.own(resource);
  const network=sdk.lifecycle.own(connectivity(sdk,configuration.eaConnectivityMode??'extended'));
  sdk.native.on('ui.popup.updated',({popup,unit})=>ui?.refreshPopup(popup,unit));
  ui=install(sdk,{gap:configuration.targetGap??16});
  return sdk.lifecycle.compose({async command(name,payload){
    if(name==='snapshot')return sdk.battle.snapshot(payload);
    if(name==='status')return {...resource.status(),connectivity:network.status()};
    if(name==='set-connectivity')return network.setMode(payload.value);
    if(name==='view'){
      const features=payload.features??['information','attributes'];
      if(!Array.isArray(features)||features.some(f=>!['information','attributes','connectivity'].includes(f)))throw Error('Unknown view feature');
      const view={information:!!ui,connectivity:network.status().mode};
      if(features.includes('attributes'))view.attributes=attributes(await sdk.battle.snapshot({detailScope:'selected'}),sdk.game.unitName);
      return view;
    }
    if(name==='set-information'){
      if(Object.keys(payload).join(',')!=='value'||typeof payload.value!=='boolean')throw Error('Expected boolean value');
      if(payload.value&&!ui){ui=install(sdk,{gap:configuration.targetGap??16});await ui.ready;}
      else if(!payload.value&&ui){const result=await ui.stop();lastStop=result;if(result.lifecycle!=='stopped')throw Error('Pro UI cleanup was not confirmed');ui=null;}
      return {information:!!ui};
    }
    throw Error('Unknown BlueMilk Pro command');
  }});
};
