import test from 'node:test';
import assert from 'node:assert/strict';
import {accountBase,makeAccountUrl,rememberReferral,displayMoney} from '../src/commerce/core.mjs';
import {BILLING_PLANS,billingEndsAt,billingLabel,dailyCents,orderAmounts,monthlyEquivalentCents,readQuantity} from '../src/commerce/plans.mjs';
const loc=value=>{const url=new URL(value);return {href:url.href,hostname:url.hostname,search:url.search};};
function storage(){const values=new Map();return {getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};}
test('GitHub account routes move to the same-origin backend app; explicit demos remain isolated',()=>{
 const location=loc('https://yonge6.github.io/mac-mini-rental/?lang=en&interval=year');
 assert.equal(accountBase(location),'https://wodemac.com/');
 const url=new URL(makeAccountUrl(location,'checkout'));assert.equal(url.origin,'https://wodemac.com');assert.equal(url.pathname,'/');assert.equal(url.searchParams.get('interval'),'year');assert.equal(url.searchParams.get('lang'),'en');
 const demo=new URL(makeAccountUrl(loc(location.href+'&demo=1&role=admin'),'admin'));assert.equal(demo.hostname,'yonge6.github.io');assert.equal(demo.searchParams.get('demo'),'1');
});
test('same-origin local and hosted subpaths survive refresh and unknown view values cannot become redirects',()=>{
 const location=loc('https://craftos.app/caldock/?lang=zh');const url=new URL(makeAccountUrl(location,'https://evil.example'));assert.equal(url.origin,'https://craftos.app');assert.equal(url.pathname,'/caldock/');assert.equal(url.searchParams.get('view'),'account');
 assert.equal(accountBase(loc('http://localhost:4173/?view=login')),'http://localhost:4173/');
});
test('referral storage keeps first touch, expires at 30 days and rejects malformed codes',()=>{
 const store=storage(),now=1000000;
 assert.equal(rememberReferral('?ref=FIRSTCODE123',store,now),'FIRSTCODE123');
 assert.equal(rememberReferral('?ref=OTHERCODE123',store,now+1000),'FIRSTCODE123');
 assert.equal(rememberReferral('?ref=OTHERCODE123',store,now+31*86400000),'OTHERCODE123');
 assert.equal(rememberReferral('?ref=<script>',storage(),now),null);
 assert.equal(rememberReferral('?ref=FIRSTCODE123',{getItem(){throw Error('blocked');}},now),'FIRSTCODE123');
});
test('order amounts match the backend: per Mac, and 2.5% off only for yearly orders of 5 or more',()=>{
 assert.deepEqual(orderAmounts('month',3),{subtotal:50700,bulkOff:0,total:50700});
 assert.deepEqual(orderAmounts('year',4),{subtotal:689520,bulkOff:0,total:689520});
 assert.deepEqual(orderAmounts('year',5),{subtotal:861900,bulkOff:21548,total:840352});
 assert.deepEqual(orderAmounts('half',5),{subtotal:456300,bulkOff:0,total:456300});
 assert.equal(monthlyEquivalentCents('year',2),405600);assert.equal(readQuantity(),1);
});
test('daily prices use a 365-day year and round up',()=>{
 assert.deepEqual(Object.entries(BILLING_PLANS).map(([key,p])=>dailyCents(p.amountCents,key)),[1272,556,528,501,473]);
});
test('plans charge the full term, off-sale plans fall back to yearly, and half-yearly routing survives first-party login',()=>{
 assert.deepEqual(Object.values(BILLING_PLANS).map(p=>[p.days,p.monthlyCents,p.months,p.amountCents]),[[7,undefined,undefined,8900],[undefined,16900,1,16900],[undefined,16055,3,48165],[undefined,15210,6,91260],[undefined,14365,12,172380]]);
 assert.equal(billingEndsAt('2026-11-04T00:00:00.000Z','week'),'2026-11-11T00:00:00.000Z');
 const route=new URL(makeAccountUrl(loc('https://yonge6.github.io/mac-mini-rental/?lang=en&interval=half'),'login',{next:'checkout'}));assert.equal(route.searchParams.get('interval'),'half');assert.equal(new URL(makeAccountUrl(loc('https://yonge6.github.io/mac-mini-rental/?interval=week'),'login',{next:'checkout'})).searchParams.get('interval'),'year');assert.equal(route.searchParams.get('next'),'checkout');assert.equal(billingLabel('quarter',true),'Quarterly');
});
test('billing terms clamp month ends like the server instead of spilling into the next month',()=>{
 assert.equal(billingEndsAt('2027-01-31T12:30:00.000Z','quarter'),'2027-04-30T12:30:00.000Z');
 assert.equal(billingEndsAt('2028-02-29T12:30:00.000Z','year'),'2029-02-28T12:30:00.000Z');
});
test('USD rendering retains cents and historical amounts while new yearly price is updated',()=>{assert.equal(displayMoney(19900),'$199');assert.equal(displayMoney(50700),'$507');assert.equal(displayMoney(154800),'$1,548');assert.equal(displayMoney(179900),'$1,799');assert.equal(displayMoney(1990),'$19.90');});
