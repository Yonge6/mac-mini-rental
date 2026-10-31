import test from 'node:test';
import assert from 'node:assert/strict';
import {accountBase,makeAccountUrl,rememberReferral,displayMoney} from '../src/commerce/core.mjs';
const loc=value=>{const url=new URL(value);return {href:url.href,hostname:url.hostname,search:url.search};};
function storage(){const values=new Map();return {getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};}
test('GitHub account routes move to the same-origin backend app; explicit demos remain isolated',()=>{
 const location=loc('https://yonge6.github.io/mac-mini-rental/?lang=en&interval=year');
 assert.equal(accountBase(location),'https://craftos.app/caldock/');
 const url=new URL(makeAccountUrl(location,'checkout'));assert.equal(url.origin,'https://craftos.app');assert.equal(url.pathname,'/caldock/');assert.equal(url.searchParams.get('interval'),'year');assert.equal(url.searchParams.get('lang'),'en');
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
test('USD rendering retains cents and annual payment amount',()=>{assert.equal(displayMoney(19900),'$199');assert.equal(displayMoney(179900),'$1,799');assert.equal(displayMoney(1990),'$19.90');});
