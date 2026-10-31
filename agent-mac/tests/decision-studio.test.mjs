import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const root=new URL('../public/decision-studio/',import.meta.url);
const context=vm.createContext({});vm.runInContext(readFileSync(new URL('model.js',root),'utf8'),context);
const M=context.CalDockModel;
test('eight annual customers pay 12384 upfront but earn 1032 per month',()=>{
 const r=M.calc({...M.defaults,annualShare:100,quarterlyShare:0});assert.equal(r.paid,8);assert.equal(r.available,8);assert.equal(r.first.receipts,12384);assert.equal(r.monthlyRevenue,1032);assert.equal(r.rows[0].earned,1032);assert.equal(r.rows[0].deferred,11352);assert.equal(r.rows[11].deferred,0);assert.notEqual(r.first.receipts,r.avgProfit);
});
test('quarterly 169 per month collects 507 per unit; monthly uses 199',()=>{
 const quarter=M.calc({...M.defaults,annualShare:0,quarterlyShare:100});assert.equal(quarter.first.receipts,8*507);assert.equal(quarter.monthlyRevenue,8*169);
 const monthly=M.calc({...M.defaults,annualShare:0,quarterlyShare:0});assert.equal(monthly.first.receipts,8*199);assert.equal(monthly.monthlyRevenue,8*199);
});
test('fleet occupancy uses total installed units and caps paying units at rentable capacity',()=>{
 assert.equal(M.calc({...M.defaults,occupancy:100}).paid,8);assert.equal(M.calc({...M.defaults,blocked:10}).paid,0);
 for(const n of [10,50,100]){const r=M.calc({...M.defaults,...M.presets[n]});assert.ok(r.paid<=r.available);assert.equal(r.paid,Math.min(Math.round(n*.8),n-M.presets[n].blocked));assert.ok(Number.isFinite(r.rows.at(-1).cash));}
});
test('revenue and cash timing differ, depreciation is non-cash and reserves are separate',()=>{
 const r=M.calc({...M.defaults,annualShare:100,quarterlyShare:0});assert.ok(r.dep>0);assert.ok(r.rows[0].serviceReserve>0);assert.ok(r.rows[0].risk>0);assert.equal(r.rows[1].receipts,0);assert.equal(r.rows[1].earned,1032);assert.ok(r.rows[0].cash>r.rows[0].protectedCash);
});
test('buildless entry uses external scripts for production CSP and has no reference password login',()=>{
 const html=readFileSync(new URL('index.html',root),'utf8');assert.ok(!html.includes('<script>'));assert.ok(html.includes('./model.js'));assert.ok(html.includes('./studio.js'));
 const ui=readFileSync(new URL('studio.js',root),'utf8');assert.ok(!ui.includes('type="password"'));assert.ok(ui.includes('new EventSource'));assert.ok(ui.includes('sessionStorage'));assert.ok(ui.includes('requestId:crypto.randomUUID()'));
});
