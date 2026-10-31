const terms = {month:{months:1,monthlyCents:19900},quarter:{months:3,monthlyCents:16900},year:{months:12,monthlyCents:12900}};
export const BILLING_PLANS = Object.freeze(Object.fromEntries(Object.entries(terms).map(([key,plan])=>[key,Object.freeze({...plan,amountCents:plan.months*plan.monthlyCents})])));
export const normalizeInterval = (value,fallback='month') => Object.hasOwn(BILLING_PLANS,value)?value:fallback;
export function billingLabel(interval,english=false){const labels={month:['月付','Monthly'],quarter:['季付','Quarterly'],year:['年付','Yearly']};return labels[normalizeInterval(interval)][english?1:0];}
export function billingEndsAt(start,interval){
  const date=new Date(start),day=date.getUTCDate();date.setUTCDate(1);date.setUTCMonth(date.getUTCMonth()+BILLING_PLANS[normalizeInterval(interval)].months);
  const last=new Date(Date.UTC(date.getUTCFullYear(),date.getUTCMonth()+1,0)).getUTCDate();date.setUTCDate(Math.min(day,last));return date.toISOString();
}
