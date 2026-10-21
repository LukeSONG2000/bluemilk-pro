const assert=require('node:assert/strict');
const render=require('../mod/attributes');
assert.deepEqual(render({}).rows,[]);
const snapshot={inspectedUnit:'second',units:[{sessionKey:'first',baseId:'VADER',attributes:{stats:[]}},
 {sessionKey:'second',baseId:'VADER',owner:1,attributes:{health:{current:50,max:100},
 protection:{permanent:{current:0,max:20}},mastery:{initial:25,current:0,netBattleDelta:-25},
 stats:[{id:5,initial:100,current:90,netBattleDelta:-10},{name:'Unknown'}]}}]};
const view=render(snapshot,id=>'原版名称');
assert.equal(view.title,'敌方 · 原版名称');assert.equal(view.summary,undefined);
assert.equal(view.rows[0].name,'速度');assert.deepEqual(view.rows[0].current,{runs:[{text:'90 ('},{text:'-10',tone:'negative'},{text:')'}]});
assert.equal(view.rows[1].current,'—');
snapshot.units[1].attributes.stats.push({id:1,initial:122233,current:158902,netBattleDelta:36669});
assert.deepEqual(render(snapshot).rows[2].current,{runs:[{text:'158902 ('},{text:'+36669',tone:'positive'},{text:')'}]});
snapshot.units[1].attributes.stats.push({id:18,initial:0.076370000839,current:0.12345678,netBattleDelta:0});
const locale=Number.prototype.toLocaleString;
Number.prototype.toLocaleString=()=>{throw Error('Intl is unavailable in the native JS runtime');};
try {assert.equal(render(snapshot).rows[3].initial,'0.076');assert.equal(render(snapshot).rows[3].current,'0.123');}
finally {Number.prototype.toLocaleString=locale;}
snapshot.units.push(snapshot.units[1]);assert.deepEqual(render(snapshot).rows,[]);
console.log('PASS Pro-owned attributes: exact instance selection, zero protection, native deltas, missing values and ambiguous selection');
