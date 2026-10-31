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

function studioHarness(savedState,storedValues){
 const values=storedValues||new Map(savedState?[['caldock-v4-state',JSON.stringify(savedState)]]:[]),listeners={},elements=new Map();
 const context=vm.createContext({URL,URLSearchParams,Intl,console,location:{hostname:'preview.example',search:'?tab=marketing',protocol:'https:',href:'https://preview.example/?tab=marketing'},
  localStorage:{getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v)},
  document:{documentElement:{},addEventListener:(name,fn)=>(listeners[name]??=[]).push(fn),querySelector:selector=>{if(!elements.has(selector))elements.set(selector,{innerHTML:'',textContent:'',addEventListener(){}});return elements.get(selector);}},
  crypto:{randomUUID:()=>String(Math.random())},setTimeout:fn=>{fn();return 0;},clearTimeout(){},confirm:()=>true,addEventListener(){}});
 vm.runInContext('window=globalThis',context);
 for(const file of ['model.js','growth-content.js','growth-template.js','growth-playbook.js','studio.js'])vm.runInContext(readFileSync(new URL(file,root),'utf8'),context);
 return {app:context.CalDockStudio,values,context,async action(action,dataset={}){const button={dataset:{action,...dataset}};const event={target:{closest:selector=>selector==='button'?button:null}};for(const listener of listeners.click||[])await listener(event);}};
}
test('published guidance preserves existing saved bilingual drafts and financial assumptions',()=>{
 const fresh=studioHarness(),saved=JSON.parse(JSON.stringify(fresh.app.getWorkspace()));
 saved.marketing.strategy={zh:'我的旧执行草稿',en:'My independent English draft'};
 saved.marketing.channels.content.budget=321;saved.scenarios.pilot.values.annual=140;
 const loaded=studioHarness(saved);assert.deepEqual(JSON.parse(JSON.stringify(loaded.app.getWorkspace())),saved);
 loaded.app.setLang('en');assert.deepEqual(JSON.parse(JSON.stringify(loaded.app.getWorkspace())),saved);
});
test('adopting recommendations records a restorable marketing change without changing financials',async()=>{
 const saved=JSON.parse(JSON.stringify(studioHarness().app.getWorkspace()));saved.marketing.strategy.zh='Preserve in history';saved.scenarios.pilot.values.monthly=217;
 const loaded=studioHarness(saved);await loaded.action('growth-template');
 const next=JSON.parse(JSON.stringify(loaded.app.getWorkspace())),history=JSON.parse(loaded.values.get('caldock-v4-history'));
 assert.deepEqual(next.scenarios,saved.scenarios);assert.deepEqual(history[0].path,['marketing']);assert.deepEqual(history[0].before,saved.marketing);
 assert.equal(Object.values(next.marketing.channels).reduce((sum,c)=>sum+c.budget,0),540);
 assert.equal(Object.values(next.marketing.channels).reduce((sum,c)=>sum+c.leads,0),40);
 assert.equal(next.marketing.funnel.leads*next.marketing.funnel.demo/100*next.marketing.funnel.trial/100*next.marketing.funnel.close/100,6);
 assert.equal(next.marketing.channels.tools.leads,0);
});

test('used Mini M6 estimate reduces acquisition, depreciation and reserves but not rental revenue',()=>{
 assert.equal(M.procurement.referenceNewBudget*M.procurement.usedPercent/100,M.defaults.purchase);
 assert.equal(M.defaults.purchase,719.2);
 const used=M.calc(),reference=M.calc({...M.defaults,purchase:899});
 const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
 near(used.c.machines*used.c.purchase,7192);
 near(reference.capex-used.capex,10*(899-719.2)*1.0775);
 near(used.dep,(used.hardware*.8+used.infra)/36);
 near(used.replacement,used.hardware*.1/12);
 near(used.saleValue,7192*.2);
 assert.equal(used.monthlyRevenue,reference.monthlyRevenue);
 assert.equal(used.first.receipts,reference.first.receipts);
 assert.deepEqual(Array.from(used.rows,r=>r.flow),Array.from(reference.rows,r=>r.flow));
});
test('legacy default costs update once with recovery history while custom values and drafts survive',async()=>{
 const old=JSON.parse(JSON.stringify(studioHarness().app.getWorkspace()));
 old.scenarios.pilot.values.purchase=899;old.scenarios.pilot.values.annual=140;
 old.scenarios.scale50.values.purchase=600;old.scenarios.scale100.values.purchase=899;
 old.marketing.strategy.zh='保留我的营销计划';
 const loaded=studioHarness(old),next=JSON.parse(JSON.stringify(loaded.app.getWorkspace()));
 assert.equal(next.scenarios.pilot.values.purchase,719.2);assert.equal(next.scenarios.scale100.values.purchase,719.2);
 assert.equal(next.scenarios.scale50.values.purchase,600);assert.equal(next.scenarios.pilot.values.annual,140);
 assert.deepEqual(next.marketing,old.marketing);
 const changes=JSON.parse(loaded.values.get('caldock-v4-history'));
 assert.equal(changes.length,2);assert.ok(changes.every(h=>h.before===899&&h.value===719.2));
 await loaded.action(undefined,{restore:changes.find(h=>h.path[1]==='pilot').id});
 const reload=studioHarness(undefined,loaded.values);
 assert.equal(reload.app.getWorkspace().scenarios.pilot.values.purchase,899);
 assert.equal(reload.values.get('caldock-used-purchase-v1'),'1');
});
test('80 percent action uses fixed reference, records changes and never compounds discounts',async()=>{
 const saved=JSON.parse(JSON.stringify(studioHarness().app.getWorkspace()));saved.scenarios.pilot.values.purchase=600;
 const loaded=studioHarness(saved);await loaded.action('used-purchase');
 assert.equal(loaded.app.getWorkspace().scenarios.pilot.values.purchase,719.2);
 const changes=JSON.parse(loaded.values.get('caldock-v4-history'));assert.equal(changes[0].before,600);
 await loaded.action('used-purchase');assert.equal(loaded.app.getWorkspace().scenarios.pilot.values.purchase,719.2);
 assert.equal(JSON.parse(loaded.values.get('caldock-v4-history')).length,changes.length);
 assert.match(readFileSync(new URL('studio.js',root),'utf8'),/step=\['purchase','purchaseTax'/);
});

test('20 percent commission follows every monthly, quarterly and annual receipt including renewals',()=>{
 const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
 for(const plan of [{annualShare:0,quarterlyShare:0},{annualShare:0,quarterlyShare:100},{annualShare:100,quarterlyShare:0}]){
  const r=M.calc({...M.defaults,...plan});
  for(const row of r.rows){near(row.commission,row.receipts*.2);near(row.commissionExpense,row.earned*.2);}
  near(r.contribution,r.blended*(1-r.c.payment/100-.2)-r.c.support);
 }
 const monthly=M.calc({...M.defaults,annualShare:0,quarterlyShare:0});
 near(monthly.rows[6].commission,8*39.8);near(monthly.rows[24].commission,8*39.8);
});
test('legacy commission scenarios keep the six-month monthly schedule and original rates',()=>{
 const legacy={...M.defaults,monthlyFirst:20,monthlyRepeat:10,quarterCommission:8,annualCommission:8,annualShare:0,quarterlyShare:0};delete legacy.monthlyCommissionMonths;
 const r=M.calc(legacy);assert.equal(r.c.monthlyCommissionMonths,6);
 assert.ok(Math.abs(r.rows[5].commission-8*199*.1)<1e-8);assert.equal(r.rows[6].commission,0);
 assert.equal(M.clean(legacy).monthlyCommissionMonths,6);
});
test('old default commissions migrate once while custom commissions retain their original term',async()=>{
 const old=JSON.parse(JSON.stringify(studioHarness().app.getWorkspace()));
 for(const s of Object.values(old.scenarios)){Object.assign(s.values,{monthlyFirst:20,monthlyRepeat:10,quarterCommission:8,annualCommission:8});delete s.values.monthlyCommissionMonths;}
 old.scenarios.scale50.values.annualCommission=7;
 const loaded=studioHarness(old),next=loaded.app.getWorkspace();
 assert.equal(next.scenarios.pilot.values.monthlyRepeat,20);assert.equal(next.scenarios.pilot.values.monthlyCommissionMonths,0);
 assert.equal(next.scenarios.scale100.values.annualCommission,20);
 assert.equal(next.scenarios.scale50.values.annualCommission,7);assert.equal(next.scenarios.scale50.values.monthlyRepeat,10);assert.equal(next.scenarios.scale50.values.monthlyCommissionMonths,6);
 const changes=JSON.parse(loaded.values.get('caldock-v4-history'));
 const repeat=changes.find(h=>h.path[1]==='pilot'&&h.path.at(-1)==='monthlyRepeat');assert.equal(repeat.before,10);
 await loaded.action(undefined,{restore:repeat.id});
 assert.equal(studioHarness(undefined,loaded.values).app.getWorkspace().scenarios.pilot.values.monthlyRepeat,10);
});
