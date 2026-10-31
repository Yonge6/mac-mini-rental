import {PLAN_CENTS} from './core.mjs';
const KEY='caldock-fictional-demo-v1';
const now=()=>new Date().toISOString();
const ago=days=>new Date(Date.now()-days*86400000).toISOString();
const userId=role=>role==='admin'?'demo-admin':'demo-you';
const fakeError=(code,message)=>Object.assign(new Error(message),{code});
function seed(){
 const users=[{id:'demo-you',display_name:'示例客户',email:'customer@example.test',created_at:ago(20)},{id:'demo-admin',display_name:'示例管理员',email:'admin@example.test',created_at:ago(30)},{id:'demo-alex',display_name:'Alex Chen',email:'alex@example.test',created_at:ago(12)},{id:'demo-jamie',display_name:'Jamie Lee',email:'jamie@example.test',created_at:ago(8)}];
 const order=(who,billing,status,days,ref=null)=>({id:crypto.randomUUID(),customer_id:who,interval:billing,status,amount_cents:PLAN_CENTS[billing],currency:'USD',version:1,renewal_enabled:status==='active',created_at:ago(days),paid_at:['paid','provisioning','active','refunded'].includes(status)?ago(days):null,delivered_at:status==='active'?ago(days-2):null,billing_ends_at:status==='active'?new Date(Date.now()+20*86400000).toISOString():null,delivery_note:status==='active'?'示例设备已完成配置。':'',affiliate_id:ref,commission_bps:1000,commission_mode:'first_order'});
 const orders=[order('demo-alex','month','active',10,'demo-you'),order('demo-jamie','year','provisioning',2,'demo-you'),order('demo-alex','year','paid',1),order('demo-jamie','month','pending_payment',0),order('demo-you','month','cancelled',15),order('demo-you','year','refunded',20)];
 return {users,orders,settings:{commission_bps:1000,commission_mode:'first_order',version:1},affiliates:[{user_id:'demo-you',code:'CALDOCKDEMO1',active:true,created_at:ago(18)}],commissions:[{id:crypto.randomUUID(),order_id:orders[0].id,affiliate_id:'demo-you',amount_cents:1990,rate_bps:1000,status:'approved',created_at:ago(10)},{id:crypto.randomUUID(),order_id:orders[1].id,affiliate_id:'demo-you',amount_cents:17990,rate_bps:1000,status:'pending',created_at:ago(2)}],referrals:[{customer_id:'demo-alex',affiliate_id:'demo-you'},{customer_id:'demo-jamie',affiliate_id:'demo-you'}]};
}
function load(){try{const data=JSON.parse(localStorage.getItem(KEY)||'null');if(data?.users&&data?.settings&&data?.orders)return data;}catch{}const data=seed();save(data);return data;}
function save(data){localStorage.setItem(KEY,JSON.stringify(data));}
export function demoSession(role){const data=load();return {user:data.users.find(u=>u.id===userId(role)),isAdmin:role==='admin',csrfToken:'explicit-demo-only'};}
export function resetDemo(){localStorage.removeItem(KEY);}
export async function demoRequest(path,{method='GET',body}={},role='customer'){
 const data=load(),who=userId(role),url=new URL(path,'https://demo.invalid'),p=url.pathname;
 if(p.startsWith('/admin/')&&role!=='admin')throw fakeError('CALDOCK_ADMIN_REQUIRED','Administrator access is required');
 let result;
 if(p==='/me')return demoSession(role);
 if(p==='/session')return {signedOut:true};
 if(p==='/capabilities')return {providers:{google:false,apple:false},payments:false,referrals:{attributionDays:30,automaticPayouts:false}};
 if(p==='/profile'){const user=data.users.find(u=>u.id===who);user.display_name=body.displayName;result=user;}
 else if(p==='/orders'&&method==='GET')return {items:data.orders.filter(o=>o.customer_id===who)};
 else if(p==='/orders'&&method==='POST'){
  const prior=data.orders.find(o=>o.customer_id===who&&o.request_key===body.requestKey);if(prior)return prior;
  if(data.orders.some(o=>o.customer_id===who&&['pending_payment','paid','provisioning','active'].includes(o.status)))throw fakeError('ACTIVE_ORDER_EXISTS','An open order already exists');
  result={id:crypto.randomUUID(),customer_id:who,request_key:body.requestKey,interval:body.interval,amount_cents:PLAN_CENTS[body.interval],currency:'USD',status:'pending_payment',version:1,created_at:now(),renewal_enabled:true,commission_bps:0,commission_mode:'first_order',delivery_note:''};data.orders.unshift(result);
 }
 else if(/^\/orders\/[^/]+$/.test(p)){
  const row=data.orders.find(o=>o.id===p.split('/')[2]&&o.customer_id===who);if(!row)throw fakeError('NOT_FOUND','Order not found');
  if(method==='PATCH'){if(row.version!==body.expectedVersion)throw fakeError('VERSION_CONFLICT','Reload before continuing');if(body.action==='cancel_pending'&&row.status!=='pending_payment')throw fakeError('INVALID_ORDER_STATE','Order cannot be cancelled');if(body.action==='cancel_pending')row.status='cancelled';row.renewal_enabled=false;row.version++;}result=row;
 }
 else if(p==='/affiliate'&&method==='POST'){if(!data.affiliates.some(a=>a.user_id===who))data.affiliates.push({user_id:who,code:crypto.randomUUID().replaceAll('-','').slice(0,12).toUpperCase(),active:true,created_at:now()});result={joined:true};}
 else if(p==='/affiliate'){
  const affiliate=data.affiliates.find(a=>a.user_id===who),commissions=data.commissions.filter(c=>c.affiliate_id===who).map(c=>({...c,interval:data.orders.find(o=>o.id===c.order_id)?.interval}));
  result={affiliate:affiliate?{...affiliate,url:new URL('./',location.href).toString().split('?')[0]+'?ref='+affiliate.code}:null,settings:data.settings,commissions,stats:{registrations:data.referrals.filter(r=>r.affiliate_id===who).length,orders:data.orders.filter(o=>o.affiliate_id===who).length,pendingCents:commissions.filter(c=>['pending','approved'].includes(c.status)).reduce((s,c)=>s+c.amount_cents,0),settledCents:commissions.filter(c=>c.status==='settled').reduce((s,c)=>s+c.amount_cents,0)}};
 }
 else if(p==='/admin/summary')return {total_orders:data.orders.length,awaiting_delivery:data.orders.filter(o=>['paid','provisioning'].includes(o.status)).length,active_macs:data.orders.filter(o=>o.status==='active').length,paid_cents:data.orders.filter(o=>['paid','provisioning','active'].includes(o.status)).reduce((s,o)=>s+o.amount_cents,0),customers:data.users.length,pending_commission_cents:data.commissions.filter(c=>['pending','approved'].includes(c.status)).reduce((s,c)=>s+c.amount_cents,0)};
 else if(p==='/admin/orders'){
  let items=data.orders.map(o=>({...o,...Object.fromEntries(['display_name','email'].map(k=>[k,data.users.find(u=>u.id===o.customer_id)?.[k]])),referral_code:data.affiliates.find(a=>a.user_id===o.affiliate_id)?.code}));
  const search=(url.searchParams.get('search')||'').toLowerCase(),filter=url.searchParams.get('status');if(filter)items=items.filter(o=>o.status===filter);if(search)items=items.filter(o=>[o.id,o.email,o.display_name].join(' ').toLowerCase().includes(search));const page=Number(url.searchParams.get('page')||0);return {items:items.slice(page*50,page*50+50),total:items.length};
 }
 else if(/^\/admin\/orders\//.test(p)){
  const row=data.orders.find(o=>o.id===p.split('/')[3]);if(!row)throw fakeError('NOT_FOUND','Order not found');if(row.version!==body.expectedVersion)throw fakeError('VERSION_CONFLICT','Reload before continuing');if(!(row.status==='paid'&&body.status==='provisioning'||row.status==='provisioning'&&body.status==='active'))throw fakeError('INVALID_ORDER_STATE','Only paid orders can be delivered');row.status=body.status;row.version++;row.delivery_note=body.deliveryNote||'';if(row.status==='active'){row.delivered_at=now();const end=new Date();row.interval==='year'?end.setFullYear(end.getFullYear()+1):end.setMonth(end.getMonth()+1);row.billing_ends_at=end.toISOString();}result=row;
 }
 else if(p==='/admin/settings'){if(method==='PATCH'){if(data.settings.version!==body.expectedVersion)throw fakeError('VERSION_CONFLICT','Reload before continuing');data.settings={commission_bps:body.commissionBps,commission_mode:body.commissionMode,version:data.settings.version+1};}result=data.settings;}
 else if(p==='/admin/affiliates')return {items:data.affiliates.map(a=>({...a,...data.users.find(u=>u.id===a.user_id),registrations:data.referrals.filter(r=>r.affiliate_id===a.user_id).length,orders:data.orders.filter(o=>o.affiliate_id===a.user_id).length}))};
 else if(p==='/admin/customers')return {items:data.users.map(u=>({...u,orders:data.orders.filter(o=>o.customer_id===u.id).length}))};
 else if(p==='/admin/commissions')return {items:data.commissions.map(c=>({...c,...Object.fromEntries(['display_name','email'].map(k=>[k,data.users.find(u=>u.id===c.affiliate_id)?.[k]]))}))};
 else if(/^\/admin\/commissions\//.test(p)){
  const row=data.commissions.find(c=>c.id===p.split('/')[3]);if(!row||row.status!==body.expectedStatus)throw fakeError('VERSION_CONFLICT','Reload before continuing');if(body.status==='settled'&&(!body.reference||row.status!=='approved'))throw fakeError('SETTLEMENT_REFERENCE_REQUIRED','A settlement reference is required');row.status=body.status;if(row.status==='settled'){row.settled_at=now();row.settlement_reference=body.reference;}result=row;
 }
 else throw fakeError('NOT_FOUND','Endpoint not found');
 save(data);return structuredClone(result);
}
