'use strict';
const labels={1:'最大生命',2:'力量',3:'敏捷',4:'智力',5:'速度',6:'物理伤害',7:'特殊伤害',8:'护甲',9:'抗性',10:'护甲穿透',11:'抗性穿透',12:'闪避等级',13:'偏转等级',14:'物理暴击等级',15:'特殊暴击等级',16:'暴击伤害',18:'效能',19:'韧性',24:'吸血',25:'最大护盾',61:'精通'};
// Frida's JS runtime can ignore toLocaleString options. Keep rendering identical
// in the game and Node without depending on Intl support.
const number=(value,signed=false)=>{
 if(typeof value!=='number'||!Number.isFinite(value))return '—';
 const rounded=Number(value.toFixed(3));
 return (signed&&rounded>0?'+':'')+String(rounded);
};
module.exports=(snapshot,unitName=id=>id)=>{
 const matches=(snapshot.units||[]).filter(unit=>unit.sessionKey===snapshot.inspectedUnit);
 if(matches.length!==1||!matches[0].attributes)return {title:'等待选中单位',summary:[],rows:[]};
 const unit=matches[0],a=unit.attributes;
 return {
  title:(unit.owner===0?'我方':unit.owner===1?'敌方':'未知阵营')+' · '+unitName(unit.baseId),
  rows:(a.stats||[]).map(stat=>{
   const current=number(stat.current),delta=stat.netBattleDelta;
   return {name:labels[stat.id]||stat.name||'—',initial:number(stat.initial),
    current:typeof delta==='number'&&Number.isFinite(delta)&&delta!==0?
     {runs:[{text:current+' ('},{text:number(delta,true),tone:delta>0?'positive':'negative'},{text:')'}]}:current};
  })
 };
};
