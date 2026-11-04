const terms = {week:{days:7,amountCents:6900},month:{months:1,monthlyCents:19900},quarter:{months:3,monthlyCents:17900},half:{months:6,monthlyCents:15900},year:{months:12,monthlyCents:13900}};
export const BILLING_PLANS = Object.freeze(Object.fromEntries(Object.entries(terms).map(([key,plan])=>[key,Object.freeze({...plan,amountCents:plan.amountCents??plan.months*plan.monthlyCents})])));
export const normalizeInterval = (value,fallback='month') => Object.hasOwn(BILLING_PLANS,value)?value:fallback;
export function billingLabel(interval,english=false){const labels={week:['周付','Weekly'],month:['月付','Monthly'],quarter:['季付','Quarterly'],half:['半年付','Half-yearly'],year:['年付','Yearly']};return labels[normalizeInterval(interval)][english?1:0];}
export function billingEndsAt(start,interval){
  const date=new Date(start),plan=BILLING_PLANS[normalizeInterval(interval)];
  if(plan.days){date.setUTCDate(date.getUTCDate()+plan.days);return date.toISOString();}
  const day=date.getUTCDate();date.setUTCDate(1);date.setUTCMonth(date.getUTCMonth()+plan.months);
  const last=new Date(Date.UTC(date.getUTCFullYear(),date.getUTCMonth()+1,0)).getUTCDate();date.setUTCDate(Math.min(day,last));return date.toISOString();
}
