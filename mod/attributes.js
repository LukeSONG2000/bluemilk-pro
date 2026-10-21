'use strict';
const labels={1:'最大生命',2:'力量',3:'敏捷',4:'智力',5:'速度',6:'物理伤害',7:'特殊伤害',8:'护甲',9:'抗性',10:'护甲穿透',11:'抗性穿透',12:'闪避等级',13:'偏转等级',14:'物理暴击等级',15:'特殊暴击等级',16:'暴击伤害',18:'效能',19:'韧性',24:'吸血',25:'最大护盾',61:'精通'};
const number=(value,signed=false)=>typeof value==='number'&&Number.isFinite(value)?(signed&&value>0?'+':'')+value.toLocaleString('en-US',{maximumFractionDigits:3}):'—';
const pool=value=>number(value?.current)+' / '+number(value?.max);
module.exports=(snapshot,unitName=id=>id)=>{
 const matches=(snapshot.units||[]).filter(unit=>unit.sessionKey===snapshot.inspectedUnit);
 if(matches.length!==1||!matches[0].attributes)return {title:'等待选中单位',summary:[],rows:[]};
 const unit=matches[0],a=unit.attributes,m=a.mastery;
 return {
  title:(unit.owner===0?'我方':unit.owner===1?'敌方':'未知阵营')+' · '+unitName(unit.baseId),
  summary:['生命 '+pool(a.health),'护盾 '+pool(a.protection?.permanent),'临时护盾 '+pool(a.protection?.bonus),
   '精通 '+number(m?.initial)+' → '+number(m?.current)+'（净变化 '+number(m?.netBattleDelta,true)+'）',
   '属性变化来源归因尚未接入。'],
  rows:(a.stats||[]).map(stat=>({name:labels[stat.id]||stat.name||'—',initial:number(stat.initial),current:number(stat.current),delta:number(stat.netBattleDelta,true)}))
 };
};
