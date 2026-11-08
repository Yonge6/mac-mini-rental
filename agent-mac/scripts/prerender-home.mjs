import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BILLING_PLANS, SALE_INTERVALS, PLAN_DISCOUNTS, billingLabel, dailyCents } from '../src/commerce/plans.mjs';
import { siteUrl, verifiedDate } from './seo-content.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'dist/client');
const shell = readFileSync(path.join(output, 'index.html'), 'utf8');
const strip = html => html.replace(/<[^>]*>/g,'').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim();
const money = cents => '$' + (cents/100).toLocaleString('en-US',{minimumFractionDigits:cents%100?2:0});
const amount = cents => '$'+Math.floor(cents/100).toLocaleString('en-US')+(cents%100?'<small>.'+String(cents%100).padStart(2,'0')+'</small>':'');
const meta = {
  zh:{ title:'美国加州 Mac mini 租赁：预装 Claude Code 与 Codex | wodeMac', description:'wodeMac 提供美国加州独享 Mac mini 租赁，7×24 在线，预装 Claude Code 和 Codex，管理员权限归你，用于软件开发、构建与测试。月付 $169 起，查看方案、交付说明与渠道合作。',url:siteUrl+'/',lang:'zh-CN'},
  en:{ title:'Mac mini Rental for Claude Code & Codex, in California | wodeMac', description:'Dedicated Mac mini rentals in California for software development, builds and testing, online 24/7 with Claude Code and Codex preinstalled. From $169 a month.',url:siteUrl+'/en.html',lang:'en'},
};

for (const language of ['zh','en']) {
  const english = language==='en', t=(zh,en)=>english?en:zh, m=meta[language];
  let source=readFileSync(path.join(root,'src',english?'source.en.html':'source.html'),'utf8');
  if (!source.includes('data-stock-pending')) throw new Error('Homepage must not publish placeholder inventory.');
  const yearly = BILLING_PLANS.year.amountCents;
  const hero = `<span>${t('','From ')}<strong>${amount(dailyCents(yearly,'year'))}</strong>${t('/天起','/day')}<em class="coffee-note coffee-note-hero">${t('每天一杯咖啡钱','About a coffee a day')}</em></span><small>${t('年付 '+PLAN_DISCOUNTS.year+'% off，一次 '+money(yearly),PLAN_DISCOUNTS.year+'% off yearly: '+money(yearly)+' billed annually')}</small>`;
  source=source.replace(/(<span[^>]*data-hero-price-slot[^>]*>)[\s\S]*?(<\/span>)/,(_match,open,close)=>open+hero+close);
  const cards=SALE_INTERVALS.map(key=>`<a class="rental-option rental-plan-card${key==='year'?' is-annual':''}" href="./?view=checkout&amp;interval=${key}&amp;lang=${language}"><span class="rental-card-top"><span class="rental-card-heading">${billingLabel(key,english)}</span><em class="rental-card-off${PLAN_DISCOUNTS[key]?'':' is-plain'}">${PLAN_DISCOUNTS[key]?PLAN_DISCOUNTS[key]+'% OFF':t('标准价','Standard')}</em></span><span class="rental-card-price"><strong>${amount(dailyCents(BILLING_PLANS[key].amountCents,key))}</strong><span>${t('/天','/day')}</span></span><span class="rental-card-charge"><b>${money(BILLING_PLANS[key].amountCents)}</b><small>${t('/ '+BILLING_PLANS[key].months+' 个月','/ '+BILLING_PLANS[key].months+' months')}</small></span><span class="rental-card-save">${t('查看此方案','View this plan')} ↗</span></a>`).join('');
  source=source.replace(/(<div[^>]*data-plan-slot="details"[^>]*>)(<\/div>)/,(_match,open,close)=>open+`<section class="rental-plan seo-static-plans" aria-label="${t('付款方案','Billing plans')}"><div class="rental-options">${cards}</div><p>${t('价格按所选周期一次支付；第三方模型账号与订阅费用另计。','Each period is paid upfront. Third-party AI accounts and subscriptions are separate.')}</p></section>`+close);
  const faqs=[...source.matchAll(/<button[^>]*data-slot="collapsible-trigger"[^>]*>([\s\S]*?)<\/button><div[^>]*data-slot="collapsible-content"[^>]*>([\s\S]*?)<\/div>/g)].map(match=>({'@type':'Question',name:strip(match[1]),acceptedAnswer:{'@type':'Answer',text:strip(match[2])}}));
  if(faqs.length<5)throw new Error('Homepage FAQ extraction failed.');
  const org={'@type':'Organization','@id':siteUrl+'/#organization',name:'wodeMac',legalName:'wodeMac Inc',url:siteUrl+'/',logo:siteUrl+'/assets/wodemac-logo.png'};
  const schema={'@context':'https://schema.org','@graph':[org,{'@type':'WebSite','@id':siteUrl+'/#website',url:siteUrl+'/',name:'wodeMac',inLanguage:['zh-CN','en'],publisher:{'@id':org['@id']}},{'@type':'WebPage','@id':m.url+'#page',url:m.url,name:m.title,description:m.description,inLanguage:m.lang,dateModified:verifiedDate,isPartOf:{'@id':siteUrl+'/#website'}},{'@type':'FAQPage','@id':m.url+'#faq',mainEntity:faqs}]};
  let html=shell.replace('<html lang="zh-CN">',`<html lang="${m.lang}">`).replace(/<title>[\s\S]*?<\/title>/,`<title>${m.title}</title>`).replace(/(<meta name="description" content=")[^"]*("\s*\/>)/,`$1${m.description}$2`).replace(/(<link rel="canonical" href=")[^"]*("\s*\/>)/,`$1${m.url}$2`).replace(/(<meta property="og:title" content=")[^"]*("\s*\/>)/,`$1${m.title}$2`).replace(/(<meta property="og:description" content=")[^"]*("\s*\/>)/,`$1${m.description}$2`).replace(/(<meta property="og:url" content=")[^"]*("\s*\/>)/,`$1${m.url}$2`);
  if(!html.includes('<div id="root"></div>'))throw new Error('Expected Vite root mount point was not found.');
  html=html.replace('<div id="root"></div>',`<div id="root" data-prerendered="${language}"><div>${source}</div></div>`).replace('</head>',`<link rel="stylesheet" href="./seo-shell.css"><script src="./seo-locale.js"></script><link rel="alternate" hreflang="zh-CN" href="${siteUrl}/"><link rel="alternate" hreflang="en" href="${siteUrl}/en.html"><link rel="alternate" hreflang="x-default" href="${siteUrl}/"><script type="application/ld+json" id="site-structured-data">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script></head>`);
  writeFileSync(path.join(output,english?'en.html':'index.html'),html);
}
console.log('Pre-rendered the same Chinese and English landing content; React keeps its existing mount.');
