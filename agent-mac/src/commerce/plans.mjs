// Weekly is off sale; it stays here so older orders still display correctly.
const terms = {week:{days:7,amountCents:8900},month:{months:1,monthlyCents:16900},quarter:{months:3,monthlyCents:16055},half:{months:6,monthlyCents:15210},year:{months:12,monthlyCents:14365}};
export const BILLING_PLANS = Object.freeze(Object.fromEntries(Object.entries(terms).map(([key,plan])=>[key,Object.freeze({...plan,amountCents:plan.amountCents??plan.months*plan.monthlyCents})])));
export const SALE_INTERVALS = Object.freeze(['month','quarter','half','year']);
export const normalizeInterval = (value,fallback='year') => SALE_INTERVALS.includes(value)?value:fallback;
const knownInterval = value => Object.hasOwn(BILLING_PLANS,value)?value:'year';
export function billingLabel(interval,english=false){const labels={week:['周付','Weekly'],month:['月付','Monthly'],quarter:['季付','Quarterly'],half:['半年付','Half-yearly'],year:['年付','Yearly']};return labels[knownInterval(interval)][english?1:0];}
export function billingEndsAt(start,interval){
  const date=new Date(start),plan=BILLING_PLANS[knownInterval(interval)];
  if(plan.days){date.setUTCDate(date.getUTCDate()+plan.days);return date.toISOString();}
  const day=date.getUTCDate();date.setUTCDate(1);date.setUTCMonth(date.getUTCMonth()+plan.months);
  const last=new Date(Date.UTC(date.getUTCFullYear(),date.getUTCMonth()+1,0)).getUTCDate();date.setUTCDate(Math.min(day,last));return date.toISOString();
}
// Display only, on a 365-day year and rounded up so the shown daily rate never understates the charge.
export const periodDays = interval => { const plan=BILLING_PLANS[knownInterval(interval)]; return plan.days ?? plan.months*365/12; };
export const dailyCents = (cents,interval) => Math.ceil(cents/periodDays(interval)-1e-9);

// A yearly order of 5 or more gets 2.5% off its first year. The backend computes the same amounts and has the final say.
export const MAX_QUANTITY = 100;
export const BULK_MIN_QUANTITY = 5;
export const PLAN_DISCOUNTS = Object.freeze({quarter:5,half:10,year:15});
export function orderAmounts(interval,quantity){const subtotal=BILLING_PLANS[knownInterval(interval)].amountCents*quantity,bulkOff=interval==='year'&&quantity>=BULK_MIN_QUANTITY?Math.round(subtotal*250/10000):0;return {subtotal,bulkOff,total:subtotal-bulkOff};}
export const monthlyEquivalentCents = (interval,quantity=1) => BILLING_PLANS.month.monthlyCents*(BILLING_PLANS[knownInterval(interval)].months??1)*quantity;
const clampQuantity = value => Math.min(MAX_QUANTITY,Math.max(1,Math.floor(Number(value))||1));
// Kept for the browser session so the chosen number survives the trip through sign-in.
export function readQuantity(){try{return clampQuantity(sessionStorage.getItem('caldock-quantity'));}catch{return 1;}}
export function saveQuantity(value){const quantity=clampQuantity(value);try{sessionStorage.setItem('caldock-quantity',String(quantity));}catch{}return quantity;}
