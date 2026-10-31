export const VIEWS = new Set(['login','account','orders','affiliate','admin']);
export const PLAN_CENTS = Object.freeze({month:19900,year:179900});
export function validReferral(value) {return typeof value==='string'&&/^[A-Z0-9]{12}$/.test(value)?value:null;}
export function rememberReferral(search,storage,now=Date.now()) {
  const key='caldock-referral-v1';
  try {
    const previous=JSON.parse(storage.getItem(key)||'null');
    if(previous&&validReferral(previous.code)&&Number.isFinite(previous.expires)&&previous.expires>now)return previous.code;
    const code=validReferral(new URLSearchParams(search).get('ref'));
    if(code){storage.setItem(key,JSON.stringify({code,expires:now+30*86400000}));return code;}
    storage.removeItem(key);
  }catch {return validReferral(new URLSearchParams(search).get('ref'));}
  return null;
}
export function accountBase(locationLike,demo=false) {
  if(locationLike.hostname==='yonge6.github.io'&&!demo)return 'https://craftos.app/caldock/';
  return new URL('./',locationLike.href).toString().split('?')[0];
}
export function makeAccountUrl(locationLike,view,extra={}) {
  const query=new URLSearchParams(locationLike.search),demo=query.get('demo')==='1';
  const url=new URL(accountBase(locationLike,demo));
  if(view)url.searchParams.set('view',VIEWS.has(view)||view==='checkout'?view:'account');
  url.searchParams.set('lang',query.get('lang')==='en'?'en':'zh');
  url.searchParams.set('interval',query.get('interval')==='year'?'year':'month');
  if(demo){url.searchParams.set('demo','1');if(query.get('role')==='admin')url.searchParams.set('role','admin');}
  const ref=validReferral(query.get('ref'));if(ref)url.searchParams.set('ref',ref);
  for(const [key,value]of Object.entries(extra))if(value!==undefined&&value!==null)url.searchParams.set(key,String(value));
  return url.toString();
}
export function displayMoney(cents) {return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:Number(cents)%100?2:0,maximumFractionDigits:2}).format(Number(cents)/100);}
