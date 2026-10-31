import {createContext,useContext,useEffect,useState,useCallback} from 'react';
import {makeAccountUrl,rememberReferral,accountBase} from './core.mjs';
import {demoRequest,demoSession} from './demo.mjs';
export const query=new URLSearchParams(location.search);
export const en=query.get('lang')==='en';
export const ct=(zh,eng)=>en?eng:zh;
export const isDemo=query.get('demo')==='1';
export const demoRole=query.get('role')==='admin'?'admin':'customer';
export const appHref=(view,extra)=>makeAccountUrl(location,view,{...(referral?{ref:referral}:{}),...extra});
export const onMarketingHost=location.hostname==='yonge6.github.io';
const referral=rememberReferral(location.search,localStorage);
const Context=createContext(null);
export function CommerceProvider({children}){
 const [state,setState]=useState({loading:!isDemo&&!onMarketingHost,user:isDemo?demoSession(demoRole).user:null,isAdmin:isDemo&&demoRole==='admin',csrfToken:null,capabilities:null,unavailable:false});
 const refresh=useCallback(async()=>{
  if(isDemo){setState({...demoSession(demoRole),loading:false,capabilities:await demoRequest('/capabilities'),unavailable:false});return;}
  if(onMarketingHost){setState(s=>({...s,loading:false}));return;}
  try{
   const cap=await fetch('/api/caldock/capabilities',{credentials:'same-origin',cache:'no-store',signal:AbortSignal.timeout(10000)});if(!cap.ok)throw new Error('Unavailable');const capabilities=await cap.json();
   const me=await fetch('/api/caldock/me',{credentials:'same-origin',cache:'no-store',signal:AbortSignal.timeout(10000)});const session=me.ok?await me.json():{user:null,isAdmin:false,csrfToken:null};if(!me.ok&&me.status!==401)throw new Error('Unavailable');
   setState({...session,capabilities,loading:false,unavailable:false});
   if(referral)fetch('/api/caldock/referral-visits',{method:'POST',credentials:'same-origin',headers:{'content-type':'application/json'},body:JSON.stringify({code:referral})}).catch(()=>{});
  }catch{setState({loading:false,user:null,isAdmin:false,csrfToken:null,capabilities:null,unavailable:true});}
 },[]);
 useEffect(()=>{refresh();},[refresh]);
 const request=useCallback(async(path,options={})=>{
  if(isDemo)return demoRequest(path,options,demoRole);
  const method=options.method||'GET';
  const response=await fetch('/api/caldock'+path,{method,credentials:'same-origin',cache:'no-store',headers:{...(options.body?{'content-type':'application/json'}:{}),...(!['GET','HEAD'].includes(method)?{'x-csrf-token':state.csrfToken||''}:{})},body:options.body?JSON.stringify(options.body):undefined,signal:AbortSignal.timeout(15000)});
  const result=await response.json().catch(()=>({}));if(!response.ok)throw Object.assign(new Error(result.error?.message||'Request failed'),{code:result.error?.code||'REQUEST_FAILED',status:response.status});return result;
 },[state.csrfToken]);
 const signOut=async()=>{if(!isDemo)await request('/session',{method:'DELETE'});location.assign(appHref('login',{demo:isDemo?'1':undefined}));};
 const beginDemo=role=>location.assign(makeAccountUrl(location,role==='admin'?'admin':query.get('next')==='checkout'?'checkout':'account',{demo:'1',role}));
 const signInHref=provider=>{
  const url=new URL('/api/caldock/auth/'+provider+'/start',accountBase(location,false));
  url.searchParams.set('next',query.get('next')==='checkout'?'checkout':query.get('next')==='affiliate'?'affiliate':'account');url.searchParams.set('lang',en?'en':'zh');url.searchParams.set('interval',query.get('interval')==='year'?'year':'month');if(referral)url.searchParams.set('ref',referral);return url.toString();
 };
 return <Context.Provider value={{...state,request,refresh,signOut,beginDemo,signInHref,demo:isDemo}}>{children}</Context.Provider>;
}
export const useCommerce=()=>useContext(Context);
export function errorText(error){const map={ACTIVE_ORDER_EXISTS:ct('你已有一笔进行中的订单，请在订单中心查看。','You already have an open order. Please view your orders.'),VERSION_CONFLICT:ct('内容已更新，请刷新后再操作。','This record changed. Reload before continuing.'),CALDOCK_ADMIN_REQUIRED:ct('此页面需要管理员权限。','Administrator access is required.'),CALDOCK_CSRF_INVALID:ct('登录状态已变化，请刷新后重试。','Your session changed. Please reload and try again.'),SETTLEMENT_REFERENCE_REQUIRED:ct('请填写已完成线下结算的凭据编号。','Enter a reference for the completed offline settlement.'),INVALID_ORDER_STATE:ct('当前订单状态不支持此操作。','This action is not available for the current order state.')};return map[error?.code]||ct('操作未完成，请稍后重试。','The action could not be completed. Please try again.');}
