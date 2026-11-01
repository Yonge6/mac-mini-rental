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
 return {app:context.CalDockStudio,values,context,input(key,value){const el={type:'number',value:String(value),min:'0',max:'120',dataset:{path:JSON.stringify(['scenarios','pilot','values',key])},matches:selector=>selector==='[data-path]'};for(const listener of listeners.input||[])listener({target:el});return el.value;},async action(action,dataset={}){const button={dataset:{action,...dataset}};const event={target:{closest:selector=>selector==='button'?button:null}};for(const listener of listeners.click||[])await listener(event);}};
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

test('monthly commission duration input normalizes fractional edits before persistence and sync',()=>{
 const loaded=studioHarness();assert.equal(loaded.input('monthlyCommissionMonths',2.5),'3');
 assert.equal(loaded.app.getWorkspace().scenarios.pilot.values.monthlyCommissionMonths,3);
 assert.equal(loaded.app.getResult().c.monthlyCommissionMonths,3);
 assert.equal(JSON.parse(loaded.values.get('caldock-v4-history'))[0].value,3);
});

// Exercise the actual buildless UI with asynchronous HTTP and controllable
// timers. The fake backend is a protocol fixture, not an authorization substitute.
async function teamStudioHarness({user=null,hostname='craftos.app',lang='zh',localState,sessionValues=new Map(),loginEnabled=true}={}){
 const copy=value=>JSON.parse(JSON.stringify(value));
 const initial=localState||copy(studioHarness().app.getWorkspace());
 const values=new Map([['caldock-v4-state',JSON.stringify(initial)],['caldock-used-purchase-v1','1'],['caldock-order-commission-v1','1']]);
 const elements=new Map(),listeners={},calls=[],timers=new Map(),streams=[];
 let clock=0,timerId=0,id=0;
 const backend={user,revision:2,state:copy(studioHarness().app.getWorkspace()),writeStatus:200,members:user?[copy(user)]:[]};
 const storage=map=>({getItem:key=>map.get(key)??null,setItem:(key,value)=>map.set(key,String(value)),removeItem:key=>map.delete(key)});
 const response=(status,data)=>({ok:status>=200&&status<300,status,json:async()=>copy(data)});
 const location={hostname,protocol:'https:',search:`?tab=team&lang=${lang}`,href:`https://${hostname}/decision-studio/?tab=team&lang=${lang}`};
 const context=vm.createContext({URL,URLSearchParams,Intl,console,location,localStorage:storage(values),sessionStorage:storage(sessionValues),
  document:{documentElement:{},activeElement:null,addEventListener:(name,fn)=>(listeners[name]??=[]).push(fn),querySelectorAll:()=>[],querySelector:selector=>{if(!elements.has(selector))elements.set(selector,{innerHTML:'',textContent:'',hidden:true,addEventListener(){}});return elements.get(selector);}},
  history:{replaceState(_state,_title,url){location.href=String(url);location.search=new URL(url).search;}},
  crypto:{randomUUID:()=>`00000000-0000-4000-8000-${String(++id).padStart(12,'0')}`},
  setTimeout:(fn,delay=0)=>{const key=++timerId;timers.set(key,{at:clock+delay,fn});return key;},clearTimeout:key=>timers.delete(key),confirm:()=>true,addEventListener(){},
  EventSource:class {constructor(url){this.url=url;streams.push(this);}close(){this.closed=true;}},
  fetch:async(url,options={})=>{
   const method=options.method||'GET',body=options.body===undefined?undefined:JSON.parse(options.body);calls.push({url,method,body,headers:options.headers,credentials:options.credentials});
   if(url==='/api/caldock/studio/health')return response(200,{app:'caldock-decision-studio',version:4,publicView:true,auth:{provider:'dingtalk',loginEnabled,loginUrl:'/api/auth/dingtalk/start?destination=caldock-studio'}});
   if(url==='/api/caldock/studio/me')return backend.user?response(200,{user:backend.user}):response(403,{error:'STUDIO_MEMBERSHIP_REQUIRED'});
   if(url==='/api/caldock/studio/state'&&method==='GET')return response(200,{state:backend.state,revision:backend.revision});
   if(url==='/api/caldock/studio/history')return response(200,{history:[]});
   if(url==='/api/caldock/studio/members')return backend.user?response(200,{members:backend.members}):response(403,{error:'STUDIO_MEMBERSHIP_REQUIRED'});
   if(url==='/api/caldock/studio/state'&&method==='PATCH'){
    if(backend.writeStatus!==200)return response(backend.writeStatus,{error:'STUDIO_READ_ONLY'});
    let object=backend.state;for(const key of body.path.slice(0,-1))object=object[key];object[body.path.at(-1)]=body.value;
    return response(200,{state:backend.state,revision:++backend.revision});
   }
   if(['/api/auth/session','/api/caldock/session'].includes(url)&&method==='DELETE'){backend.user=null;return response(200,{ok:true});}
   throw new Error(`Unexpected request ${method} ${url}`);
  }});
 vm.runInContext('window=globalThis',context);
 for(const file of ['model.js','growth-content.js','growth-template.js','growth-playbook.js','studio.js'])vm.runInContext(readFileSync(new URL(file,root),'utf8'),context);
 const settle=async()=>{await new Promise(setImmediate);await new Promise(setImmediate);};
 const tick=async(ms=500)=>{const end=clock+ms;for(let n=0;n<100;n++){const entry=[...timers].sort((a,b)=>a[1].at-b[1].at).find(([,timer])=>timer.at<=end);if(!entry)break;const [key,timer]=entry;timers.delete(key);clock=timer.at;await timer.fn();await settle();}clock=end;await settle();};
 const action=async(action,dataset={})=>{const button={dataset:{action,...dataset}};for(const fn of listeners.click||[])await fn({target:{closest:selector=>selector==='button'?button:null}});await settle();};
 const input=(key,value)=>{const el={type:'number',value:String(value),min:'0',max:'1000000',dataset:{path:JSON.stringify(['scenarios','pilot','values',key])},matches:selector=>selector==='[data-path]'};for(const fn of listeners.input||[])fn({target:el});};
 await settle();return {app:context.CalDockStudio,backend,values,sessionValues,calls,streams,context,settle,tick,action,input,html:()=>elements.get('#app').innerHTML};
}
const dingMember=(role='editor')=>({id:'8d620391-c6cb-407e-91d4-9a19b833b092',name:'Team Member',username:'member-id',role,csrf:'test-csrf-token',provider:'dingtalk'});

test('GitHub local plans offer language-aware DingTalk login without uploading local drafts',async()=>{
 const local=JSON.parse(JSON.stringify(studioHarness().app.getWorkspace()));local.marketing.strategy.zh='Private local working draft';
 const h=await teamStudioHarness({hostname:'yonge6.github.io',localState:local});
 assert.match(h.html(),/href="https:\/\/craftos\.app\/api\/auth\/dingtalk\/start\?destination=caldock-studio&lang=zh"/);
 assert.equal(h.calls.length,0);assert.equal(h.app.getWorkspace().marketing.strategy.zh,'Private local working draft');
 h.app.setLang('en');assert.match(h.html(),/destination=caldock-studio&lang=en/);
 await h.tick();assert.equal(JSON.parse(h.values.get('caldock-v4-state')).marketing.strategy.zh,'Private local working draft');
});
test('public shared team page uses DingTalk and remains read-only before authentication',async()=>{
 const h=await teamStudioHarness();assert.equal(h.app.status().available,true);
 assert.match(h.html(),/href="\/api\/auth\/dingtalk\/start\?destination=caldock-studio&lang=zh"/);
 assert.doesNotMatch(h.html(),/Google|Apple|id="member-form"/);
 h.input('monthly',250);await h.tick();assert.equal(h.app.getWorkspace().scenarios.pilot.values.monthly,199);
 assert.equal(h.calls.filter(call=>call.method==='PATCH').length,0);
 const unavailable=await teamStudioHarness({loginEnabled:false});assert.match(unavailable.html(),/aria-disabled="true"/);assert.doesNotMatch(unavailable.html(),/href="\/api\/auth\/dingtalk/);
});
test('DingTalk owner loads shared data without replacing local plans and can select known members',async()=>{
 const local=JSON.parse(JSON.stringify(studioHarness().app.getWorkspace()));local.scenarios.pilot.values.monthly=321;local.marketing.strategy.en='Local only';
 const owner={...dingMember('owner'),name:'<script>alert(1)</script>'};const h=await teamStudioHarness({user:owner,localState:local});await h.tick();
 assert.equal(h.app.status().role,'owner');assert.equal(h.app.getWorkspace().scenarios.pilot.values.monthly,199);
 assert.equal(h.values.get('caldock-v4-state'),JSON.stringify(local));assert.match(h.html(),/id="member-form"/);
 assert.match(h.html(),/id="studio-member-ids"/);assert.ok(h.html().includes(`value="${owner.id}"`));
 assert.doesNotMatch(h.html(),/<script>alert/);assert.match(h.html(),/&lt;script&gt;alert/);
});
test('read-only DingTalk member gains edit controls only after refreshed server permission',async()=>{
 const h=await teamStudioHarness({user:dingMember('viewer')});assert.doesNotMatch(h.html(),/id="member-form"/);
 h.input('monthly',220);await h.tick();assert.equal(h.app.getWorkspace().scenarios.pilot.values.monthly,199);
 h.backend.user=dingMember('editor');await h.action('refresh-access');assert.equal(h.app.status().role,'editor');
 h.input('monthly',220);await h.tick();assert.equal(h.backend.state.scenarios.pilot.values.monthly,220);
 const write=h.calls.find(call=>call.method==='PATCH');assert.equal(write.headers['X-CSRF-Token'],'test-csrf-token');assert.equal(write.credentials,'same-origin');
});
test('sign-out targets the identity provider session and returns to the public plan',async()=>{
 for(const provider of ['dingtalk','caldock']){
  const h=await teamStudioHarness({user:{...dingMember(),provider}});await h.action('logout');
  const deletes=h.calls.filter(call=>call.method==='DELETE');assert.equal(deletes.length,1);
  assert.equal(deletes[0].url,provider==='dingtalk'?'/api/auth/session':'/api/caldock/session');assert.equal(deletes[0].headers['X-CSRF-Token'],'test-csrf-token');
  assert.equal(h.app.status().user,undefined);assert.equal(h.app.status().pending,0);assert.equal(h.app.status().available,true);assert.match(h.html(),/dingtalk\/start/);
 }
});
test('expired editing access retains pending drafts and blocks more changes until reauthentication',async()=>{
 const h=await teamStudioHarness({user:dingMember()});h.backend.writeStatus=403;
 h.input('monthly',222);await h.tick();assert.equal(h.app.status().authRequired,true);assert.equal(h.app.status().pending,1);
 const key='caldock-studio-draft:'+dingMember().id,queued=JSON.parse(h.sessionValues.get(key));
 assert.equal(queued[0][1].before,199);assert.equal(queued[0][1].value,222);assert.equal(h.backend.state.scenarios.pilot.values.monthly,199);
 h.input('monthly',240);await h.tick();assert.equal(h.app.getWorkspace().scenarios.pilot.values.monthly,222);assert.equal(h.calls.filter(call=>call.method==='PATCH').length,1);
 assert.match(h.html(),/data-action="refresh-access"/);assert.match(h.html(),/dingtalk\/start/);
 h.backend.writeStatus=200;await h.action('refresh-access');await h.tick();
 assert.equal(h.app.status().authRequired,false);assert.equal(h.app.status().pending,0);assert.equal(h.backend.state.scenarios.pilot.values.monthly,222);assert.equal(h.sessionValues.has(key),false);
});
test('pending drafts survive reload for the same identity but are never submitted as another member',async()=>{
 const first=await teamStudioHarness({user:dingMember()});first.backend.writeStatus=403;first.input('monthly',229);await first.tick();
 const reloaded=await teamStudioHarness({user:dingMember(),sessionValues:first.sessionValues});
 assert.equal(reloaded.app.status().pending,1);assert.equal(reloaded.app.getWorkspace().scenarios.pilot.values.monthly,229);
 const another={...dingMember(),id:'c5d01684-2d8c-4c3a-b986-604794df2f82',username:'another-member'};
 reloaded.backend.user=another;await reloaded.action('refresh-access');await reloaded.tick();
 assert.equal(reloaded.app.status().user,'another-member');assert.equal(reloaded.app.status().pending,0);assert.equal(reloaded.app.getWorkspace().scenarios.pilot.values.monthly,199);
 assert.equal(reloaded.calls.filter(call=>call.method==='PATCH').length,0);assert.equal(first.sessionValues.has('caldock-studio-draft:'+dingMember().id),true);
});
