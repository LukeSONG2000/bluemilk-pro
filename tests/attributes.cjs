const assert=require('node:assert/strict');
const render=require('../mod/attributes');
assert.deepEqual(render({}).rows,[]);
const snapshot={inspectedUnit:'second',units:[{sessionKey:'first',baseId:'VADER',attributes:{stats:[]}},
 {sessionKey:'second',baseId:'VADER',owner:1,attributes:{health:{current:50,max:100},
 protection:{permanent:{current:0,max:20}},mastery:{initial:25,current:0,netBattleDelta:-25},
 stats:[{id:5,initial:100,current:90,netBattleDelta:-10},{name:'Unknown'}]}}]};
const view=render(snapshot,id=>'原版名称');
assert.equal(view.title,'敌方 · 原版名称');assert.ok(view.summary.includes('护盾 0 / 20'));
assert.equal(view.rows[0].name,'速度');assert.equal(view.rows[0].delta,'-10');
assert.equal(view.rows[1].current,'—');
snapshot.units.push(snapshot.units[1]);assert.deepEqual(render(snapshot).rows,[]);
console.log('PASS Pro-owned attributes: exact instance selection, zero protection, native deltas, missing values and ambiguous selection');
