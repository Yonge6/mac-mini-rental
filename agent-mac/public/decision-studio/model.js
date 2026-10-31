/* CalDock Decision Studio — deterministic planning, USD, no verified hardware quotes. */
(function(root){
'use strict';
const defaults={machines:10,blocked:2,occupancy:80,monthly:199,quarterly:169,annual:129,annualShare:70,quarterlyShare:20,purchase:899,purchaseTax:7.75,networkSetup:800,ups:600,fitout:500,watts:30,networkWatts:60,electricity:.30,cooling:1.6,network:200,software:8,support:10,labor:500,other:100,rent:0,marketing:100,launchBudget:540,payment:3,refund:2,replacement:10,life:36,residual:20,monthlyFirst:20,monthlyRepeat:10,quarterCommission:8,annualCommission:8,monthlyRenew:100,quarterlyRenew:100,annualRenew:100,horizon:36,saleResidual:20};
const ranges={machines:[1,10000],blocked:[0,10000],occupancy:[0,100],monthly:[0,10000],quarterly:[0,10000],annual:[0,10000],annualShare:[0,100],quarterlyShare:[0,100],purchase:[0,100000],purchaseTax:[0,50],networkSetup:[0,10000000],ups:[0,10000000],fitout:[0,10000000],watts:[0,1000],networkWatts:[0,100000],electricity:[0,10],cooling:[1,5],network:[0,1000000],software:[0,10000],support:[0,10000],labor:[0,1000000],other:[0,1000000],rent:[0,1000000],marketing:[0,1000000],launchBudget:[0,1000000],payment:[0,50],refund:[0,50],replacement:[0,100],life:[1,120],residual:[0,100],monthlyFirst:[0,100],monthlyRepeat:[0,100],quarterCommission:[0,100],annualCommission:[0,100],monthlyRenew:[0,100],quarterlyRenew:[0,100],annualRenew:[0,100],horizon:[12,60],saleResidual:[0,100]};
const integer=new Set(['machines','blocked','life','horizon']);
function clean(x={}){const c={...defaults};for(const k of Object.keys(defaults)){const n=Number(x[k]);if(x[k]!==''&&x[k]!=null&&Number.isFinite(n)){c[k]=Math.min(ranges[k][1],Math.max(ranges[k][0],n));if(integer.has(k))c[k]=Math.round(c[k]);}}c.blocked=Math.min(c.blocked,c.machines);c.quarterlyShare=Math.min(c.quarterlyShare,100-c.annualShare);return c;}
function allocate(n,c){let raw=[100-c.annualShare-c.quarterlyShare,c.quarterlyShare,c.annualShare].map(x=>x*n/100),v=raw.map(Math.floor),order=[0,1,2].sort((a,b)=>(raw[b]-v[b])-(raw[a]-v[a])||b-a);let left=n-v.reduce((a,b)=>a+b,0);for(let i=0;i<left;i++)v[order[i%3]]++;return v;}
function calc(x={}){const c=clean(x),available=c.machines-c.blocked,paid=Math.min(Math.floor(c.machines*c.occupancy/100+1e-9),available),counts=allocate(paid,c),[m,q,y]=counts;
const hardware=c.machines*c.purchase*(1+c.purchaseTax/100),infra=c.networkSetup+c.ups+c.fitout,capex=hardware+infra;
const electricity=(c.machines*c.watts+c.networkWatts)/1000*730*c.electricity*c.cooling;
const costLines={electricity,network:c.network,software:c.software*c.machines,labor:c.labor,other:c.other,rent:c.rent,marketing:c.marketing,support:paid*c.support};
const fixed=Object.entries(costLines).filter(([k])=>k!=='support').reduce((s,[,v])=>s+v,0),opex=fixed+paid*c.support;
const dep=hardware*(1-c.residual/100)/c.life+infra/c.life,monthlyRevenue=m*c.monthly+q*c.quarterly+y*c.annual;
const replacement=hardware*c.replacement/100/12;
let cash=-capex-c.launchBudget,cumReceipt=0,cumEarned=0,risk=0;const rows=[];
for(let t=1;t<=c.horizon;t++){
 const am=m*Math.pow(c.monthlyRenew/100,t-1),aq=q*Math.pow(c.quarterlyRenew/100,Math.floor((t-1)/3)),ay=y*Math.pow(c.annualRenew/100,Math.floor((t-1)/12));
 const active=am+aq+ay,receipts=am*c.monthly+((t-1)%3===0?aq*c.quarterly*3:0)+((t-1)%12===0?ay*c.annual*12:0);
 const monthlyComm=t===1?c.monthlyFirst:t<=6?c.monthlyRepeat:0;
 const commission=am*c.monthly*monthlyComm/100+((t-1)%3===0?aq*c.quarterly*3*c.quarterCommission/100:0)+((t-1)%12===0?ay*c.annual*12*c.annualCommission/100:0);
 const earned=am*c.monthly+aq*c.quarterly+ay*c.annual,commissionExpense=am*c.monthly*monthlyComm/100+aq*c.quarterly*c.quarterCommission/100+ay*c.annual*c.annualCommission/100;
 const fees=receipts*c.payment/100,operating=fixed+active*c.support,flow=receipts-fees-commission-operating;
 const remainingQ=aq>0?2-(t-1)%3:0,remainingY=ay>0?11-(t-1)%12:0,maxRemaining=Math.max(remainingQ,remainingY);
 const serviceReserve=fixed*maxRemaining+c.support*(aq*remainingQ+ay*remainingY);
 cash+=flow;cumReceipt+=receipts;cumEarned+=earned;risk+=receipts*c.refund/100+replacement;
 const deferred=Math.max(0,cumReceipt-cumEarned),profit=earned*(1-c.payment/100)-commissionExpense-operating-(t<=c.life?dep:0)-(t===1?c.launchBudget:0);
 rows.push({month:t,active,receipts,earned,commission,commissionExpense,fees,operating,flow,cash,risk,serviceReserve,protectedCash:cash-risk-serviceReserve,deferred,profit,cumReceipt,cumEarned});
}
const first=rows[0],firstTerm=y?12:q?3:m?1:0,fullServiceReserve=fixed*firstTerm+c.support*(m+q*3+y*12);
const protectedUpfront=first.receipts-first.fees-first.commission-first.receipts*c.refund/100-replacement*firstTerm-fullServiceReserve;
const first12=rows.slice(0,12),avgProfit=first12.reduce((s,r)=>s+r.profit,0)/12,avgFlow=first12.reduce((s,r)=>s+r.flow,0)/12;
const weights=[100-c.annualShare-c.quarterlyShare,c.quarterlyShare,c.annualShare].map(a=>a/100);
const blended=[c.monthly,c.quarterly,c.annual].reduce((s,p,i)=>s+p*weights[i],0);
const commUnit=weights[0]*c.monthly*(c.monthlyFirst+5*c.monthlyRepeat)/1200+weights[1]*c.quarterly*c.quarterCommission/100+weights[2]*c.annual*c.annualCommission/100;
const contribution=blended*(1-c.payment/100)-commUnit-c.support,breakeven=contribution>0?Math.ceil((fixed+dep+c.launchBudget/12)/contribution):null;
const firstCross=rows.find(r=>r.cash>=0)?.month??null;
let durable=null;for(let i=0;i<rows.length;i++){if(rows.slice(i).every(r=>r.protectedCash>=0)){durable=rows[i].month;break;}}
const annualDen=1-(c.payment+c.annualCommission)/100;
const annualFloor=paid>0&&annualDen>0?((fixed+dep+c.launchBudget/12)/paid+c.support)/annualDen:null;
const last=rows.at(-1),saleValue=c.machines*c.purchase*c.saleResidual/100;
// Conservative liquidation test: fully refund all unearned prepaid services; release earmarked reserves only on actual exit.
const exitCash=last.cash+saleValue-last.deferred;
const cashflows=[-capex-c.launchBudget,...rows.map(r=>r.flow)];cashflows[cashflows.length-1]+=saleValue-last.deferred;
const irr=uniqueIRR(cashflows);
return{c,available,paid,counts,hardware,infra,capex,electricity,costLines,fixed,opex,dep,monthlyRevenue,replacement,rows,first,firstTerm,fullServiceReserve,protectedUpfront,avgProfit,avgFlow,blended,contribution,breakeven,annualFloor,firstCross,durable,saleValue,exitCash,irr,roi:(capex+c.launchBudget)>0?exitCash/(capex+c.launchBudget):null};}
function uniqueIRR(cfs){const signs=cfs.filter(v=>Math.abs(v)>1e-9).map(Math.sign);let changes=0;for(let i=1;i<signs.length;i++)if(signs[i]!==signs[i-1])changes++;if(changes!==1||signs[0]!==-1||signs.at(-1)!==1)return null;const npv=r=>cfs.reduce((s,v,t)=>s+v/Math.pow(1+r,t),0);const roots=[];let prevR=-.8,prevV=npv(prevR);for(let i=1;i<=600;i++){let r=Math.exp(Math.log(.2)+(Math.log(11)-Math.log(.2))*i/600)-1,v=npv(r);if(Number.isFinite(v)&&Number.isFinite(prevV)&&v*prevV<0){let lo=prevR,hi=r;for(let j=0;j<90;j++){let mid=(lo+hi)/2;if(npv(lo)*npv(mid)<=0)hi=mid;else lo=mid;}let root=(lo+hi)/2;if(!roots.some(v=>Math.abs(v-root)<1e-6))roots.push(root);}prevR=r;prevV=v;}return roots.length===1?Math.pow(1+roots[0],12)-1:null;}
const presets={10:{machines:10,blocked:2,networkSetup:800,ups:600,fitout:500,network:200,networkWatts:60,labor:500,other:100,marketing:100,launchBudget:540},50:{machines:50,blocked:3,networkSetup:2000,ups:2500,fitout:5000,network:400,networkWatts:180,labor:1500,other:250,marketing:350,launchBudget:1200},100:{machines:100,blocked:5,networkSetup:4000,ups:5000,fitout:10000,network:900,networkWatts:300,labor:2800,other:450,marketing:650,launchBudget:2000}};
const api={defaults,ranges,clean,allocate,calc,presets,uniqueIRR};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.CalDockModel=api;
})(typeof globalThis!=='undefined'?globalThis:this);
