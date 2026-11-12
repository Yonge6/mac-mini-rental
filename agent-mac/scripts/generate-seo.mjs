import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BILLING_PLANS, SALE_INTERVALS, billingLabel } from '../src/commerce/plans.mjs';
import { guides, siteUrl, verifiedDate, homeUpdated, sourceLinks, sourceSets, facts } from './seo-content.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicRoot = path.join(root, 'public');
const guideRoot = path.join(publicRoot, 'guides');
mkdirSync(guideRoot, { recursive: true });
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const langOf = guide => guide.lang === 'en' ? 'en' : 'zh';
const urlFor = guide => `${siteUrl}/guides/${guide.slug}.html`;
// A guide written after the last full review carries its own date.
const dateOf = guide => [verifiedDate, guide.published].filter(Boolean).sort().pop();
const latest = [homeUpdated, ...guides.map(dateOf)].sort().pop();
const money = cents => '$' + (cents / 100).toLocaleString('en-US', { minimumFractionDigits: cents % 100 ? 2 : 0 });

const L = {
  zh: {
    html: 'zh-CN', home: '../?lang=zh', pricing: '../?lang=zh#pricing', contact: '../?lang=zh#partners', index: './', indexUrl: siteUrl + '/guides/',
    indexName: '中文指南', skip: '跳到正文', back: '返回 WodeMac 官网', navLabel: '页面导航', navPricing: '配置与价格', navContact: '联系与合作',
    crumbLabel: '面包屑', crumbHome: '官网', eyebrow: 'WodeMac · 开发环境与合作指南', updated: '资料整理与核验', faq: '常见问题',
    sourcesHead: '信息来源与核对入口', sourcesNote: '本页根据核验日可读取的官网资料整理。配置、库存、价格及规则可能更新，实际以当前订单、确认报价和服务条款为准。它是选型与准备指南，不是已完成项目的客户案例。',
    nextEyebrow: '从一个真实任务开始', nextHead: '把项目和交付要求聊清楚。', nextText: '说明要完成的开发任务、负责人和验收标准，再确认配置、费用与支持范围。', nextCta: '联系 WodeMac ↗', nextPlans: '查看当前配置与方案',
    related: '继续了解', read: '阅读指南 ↗', footer: '我的 Mac，在美国加州。由 WodeMac Inc 运营。', terms: '../legal/terms.html', privacy: '../legal/privacy.html', termsLabel: '服务条款', privacyLabel: '隐私政策', contactLabel: '联系 WodeMac',
    caption: '单台 Mac mini 基础租赁方案（USD）', period: '周期', charge: '一次支付', term: '服务周期', months: n => `${n} 个月`,
  },
  en: {
    html: 'en', home: '../en.html', pricing: '../en.html#pricing', contact: '../en.html#partners', index: './en.html', indexUrl: siteUrl + '/guides/en.html',
    indexName: 'Guides', skip: 'Skip to content', back: 'Back to WodeMac', navLabel: 'Page navigation', navPricing: 'Plans & pricing', navContact: 'Contact',
    crumbLabel: 'Breadcrumb', crumbHome: 'Home', eyebrow: 'WodeMac · Remote Mac guides', updated: 'Reviewed', faq: 'FAQ',
    sourcesHead: 'Sources', sourcesNote: 'Compiled from information published on the review date. Configuration, stock, prices and rules may change; the current order page, confirmed quotes and terms take precedence. This is a setup guide, not a customer case study.',
    nextEyebrow: 'Start with one real task', nextHead: 'Tell us what you want to build.', nextText: 'Share the task, owner and acceptance criteria, then confirm configuration, cost and support.', nextCta: 'Contact WodeMac ↗', nextPlans: 'See current plans',
    related: 'Keep reading', read: 'Read guide ↗', footer: 'Your own Mac, in California, USA. Operated by WodeMac Inc.', terms: '../legal/terms.en.html', privacy: '../legal/privacy.en.html', termsLabel: 'Terms', privacyLabel: 'Privacy', contactLabel: 'Contact WodeMac',
    caption: 'Single Mac mini base plans (USD)', period: 'Plan', charge: 'Paid upfront', term: 'Term', months: n => `${n} month${n > 1 ? 's' : ''}`,
  },
};
const sourceLabelsEn = { 'WodeMac 官网与当前配置、付款方案': 'WodeMac homepage, configuration and plans', 'WodeMac 服务条款': 'WodeMac terms', 'WodeMac 隐私政策': 'WodeMac privacy policy', 'Claude Code 官方安装与使用准备': 'Claude Code setup (official)', 'Anthropic 当前支持地区与规则': 'Anthropic supported countries', 'OpenAI Codex 官方文档': 'OpenAI Codex docs', 'Codex CLI 官方说明': 'Codex CLI docs', 'OpenAI 支持的国家和地区': 'OpenAI supported countries', 'Claude Code 官方概览': 'Claude Code overview (official)', 'Apple Xcode 官方页面': 'Apple Xcode' };
const priceTable = lang => { const t = L[lang]; return `<div class="table-wrap"><table><caption>${t.caption}</caption><thead><tr><th scope="col">${t.period}</th><th scope="col">${t.charge}</th><th scope="col">${t.term}</th></tr></thead><tbody>${SALE_INTERVALS.map(key => `<tr><th scope="row">${billingLabel(key, lang === 'en')}</th><td>${money(BILLING_PLANS[key].amountCents)}</td><td>${t.months(BILLING_PLANS[key].months)}</td></tr>`).join('')}</tbody></table></div>`; };
const organization = { '@type':'Organization', '@id':`${siteUrl}/#organization`, name:'WodeMac', legalName:'WodeMac Inc', url:siteUrl+'/', email:'hustyy986@gmail.com', sameAs:['https://wodemac.vilesaint.com/'] };
const aboutOf = guide => (guide.about ?? []).map(name => ({ '@type':'SoftwareApplication', name, applicationCategory:'DeveloperApplication' }));
const relatedTo = guide => guides.filter(item => item.slug !== guide.slug && langOf(item) === langOf(guide)).map(item => [item, (item.about ?? []).filter(name => (guide.about ?? []).includes(name)).length + (item.slug === guide.pair ? 0 : 0)]).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([item]) => item);
const product = lang => ({ '@type':'Product', '@id':`${siteUrl}/#mac-mini-rental`, name: lang === 'en' ? 'Dedicated M6 Mac mini rental in California' : '美国加州独享 M6 Mac mini 租赁', description: facts[lang], brand:{'@id':organization['@id']}, offers: SALE_INTERVALS.map(key => ({ '@type':'Offer', name: billingLabel(key, lang === 'en'), price: (BILLING_PLANS[key].amountCents / 100).toFixed(2), priceCurrency:'USD', url: siteUrl + '/', seller:{'@id':organization['@id']} })) });

function document({ lang, title, description, canonical, body, schema, alternate }) {
  const t = L[lang];
  const alt = alternate ? `<link rel="alternate" hreflang="${alternate.lang}" href="${alternate.href}"><link rel="alternate" hreflang="${t.html}" href="${canonical}">` : '';
  return `<!doctype html>
<!-- Generated by scripts/generate-seo.mjs from scripts/seo-content.mjs. -->
<html lang="${t.html}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#191411"><title>${esc(title)} | WodeMac</title><meta name="description" content="${esc(description)}"><meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large"><link rel="canonical" href="${canonical}">${alt}<meta property="og:type" content="article"><meta property="og:site_name" content="WodeMac"><meta property="og:title" content="${esc(title)} | WodeMac"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${siteUrl}/assets/wodemac-og.jpg"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="../assets/wodemac-icon.svg"><link rel="stylesheet" href="./guides.css"><script type="application/ld+json">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script></head><body><a class="skip" href="#content">${t.skip}</a><header class="guide-nav"><a href="${t.home}" aria-label="${t.back}"><img src="../assets/wodemac-logo.png" width="157" height="24" alt="WodeMac"></a><nav aria-label="${t.navLabel}"><a href="${t.index}">${t.indexName}</a><a href="${t.pricing}">${t.navPricing}</a><a href="${t.contact}">${t.navContact}</a></nav></header><main id="content">${body}</main><footer class="guide-footer"><p>${t.footer}</p><nav><a href="${t.terms}">${t.termsLabel}</a><a href="${t.privacy}">${t.privacyLabel}</a><a href="${t.contact}">${t.contactLabel}</a></nav></footer></body></html>\n`;
}

for (const guide of guides) {
  const lang = langOf(guide), t = L[lang];
  const canonical = urlFor(guide);
  const sources = (sourceSets[guide.sources] ?? sourceLinks).map(([label, href]) => [lang === 'en' ? (sourceLabelsEn[label] ?? label) : label, href]);
  const faq = guide.faqs.map(([question, answer]) => `<details open><summary>${esc(question)}</summary><p>${esc(answer)}</p></details>`).join('');
  const schema = { '@context':'https://schema.org', '@graph':[
    organization,
    { '@type':'Article', '@id':canonical+'#article', headline:guide.title, description:guide.description, inLanguage:t.html, datePublished:guide.published ?? verifiedDate, dateModified:dateOf(guide), author:{'@id':organization['@id']}, publisher:{'@id':organization['@id']}, mainEntityOfPage:canonical, image:`${siteUrl}/assets/wodemac-og.jpg`, ...(guide.about ? { about: aboutOf(guide) } : {}) },
    { '@type':'BreadcrumbList', itemListElement:[ {'@type':'ListItem',position:1,name:'WodeMac',item:siteUrl+'/'}, {'@type':'ListItem',position:2,name:t.indexName,item:t.indexUrl}, {'@type':'ListItem',position:3,name:guide.title,item:canonical} ] },
    { '@type':'FAQPage', '@id':canonical+'#faq', mainEntity:guide.faqs.map(([name,text]) => ({'@type':'Question', name, acceptedAnswer:{'@type':'Answer',text}})) },
    ...(guide.sections.some(([, html]) => html.includes('{{PRICE_TABLE}}')) ? [product(lang)] : []),
  ] };
  const siblings = relatedTo(guide);
  const paired = guide.pair ? guides.find(item => item.slug === guide.pair) : null;
  const alternate = paired ? { lang: L[langOf(paired)].html, href: urlFor(paired) } : undefined;
  const body = `<article><nav class="breadcrumb" aria-label="${t.crumbLabel}"><a href="${t.home}">${t.crumbHome}</a><span>/</span><a href="${t.index}">${t.indexName}</a></nav><header class="article-head"><p class="eyebrow">${t.eyebrow}</p><h1>${esc(guide.title)}</h1><p class="updated">${t.updated}: <time datetime="${dateOf(guide)}">${dateOf(guide)}</time> · WodeMac</p><p class="answer">${esc(guide.answer)}</p></header><div class="article-body">${guide.sections.map(([heading, html], index) => `<section id="section-${index+1}"><h2>${esc(heading)}</h2>${html.replace('{{PRICE_TABLE}}', priceTable(lang))}</section>`).join('')}<section id="faq"><h2>${t.faq}</h2>${faq}</section><section class="sources"><h2>${t.sourcesHead}</h2><p>${t.sourcesNote}</p><ul>${sources.map(([label,href]) => `<li><a href="${href}">${esc(label)}</a></li>`).join('')}</ul></section><section class="next-step"><p class="eyebrow">${t.nextEyebrow}</p><h2>${t.nextHead}</h2><p>${t.nextText}</p><a class="action" href="${t.contact}">${t.nextCta}</a><a href="${t.pricing}">${t.nextPlans}</a></section></div></article><aside class="related"><h2>${t.related}</h2><div class="guide-cards">${siblings.map(item=>`<a class="guide-card" href="./${item.slug}.html"><h3>${esc(item.title)}</h3><p>${esc(item.description)}</p></a>`).join('')}</div></aside>`;
  writeFileSync(path.join(guideRoot, guide.slug+'.html'), document({lang,title:guide.title,description:guide.description,canonical,body,schema,alternate}));
}

const zhGuides = guides.filter(g => langOf(g) === 'zh');
const enGuides = guides.filter(g => langOf(g) === 'en');
const cards = (list, lang) => list.map(guide => `<a class="guide-card" href="./${guide.slug}.html"><span>${L[lang].read}</span><h2>${esc(guide.title)}</h2><p>${esc(guide.description)}</p></a>`).join('');
const collection = (name, url, lang, list) => ({'@context':'https://schema.org','@graph':[organization,{'@type':'CollectionPage',url,name,inLanguage:L[lang].html,dateModified:verifiedDate,hasPart:list.map(g=>({'@type':'Article',name:g.title,url:urlFor(g)}))}]});

const indexTitle = '美国 Mac mini 租赁、Claude Code 与 Codex 中文指南';
writeFileSync(path.join(guideRoot,'index.html'), document({lang:'zh', title:indexTitle, description:'在美国加州独享 Mac mini 上使用 Claude Code 和 OpenAI Codex：选型、账号准备、两者对比、7×24 持续运行、iOS 开发，以及团队、老师和推广伙伴合作的中文指南。', canonical:siteUrl+'/guides/', alternate:{lang:'en',href:siteUrl+'/guides/en.html'}, body:`<header class="article-head"><p class="eyebrow">我的 Mac，在美国加州。</p><h1>${indexTitle}</h1><p class="answer">WodeMac 为软件开发与测试提供美国加州独享 Mac mini，预装 Claude Code 和 Codex。先确认实际项目、第三方账号资格与交付要求，再选择环境和合作方式。</p><p class="updated">资料核验：<time datetime="${verifiedDate}">${verifiedDate}</time> · 配置与规则以当前官网为准</p></header><div class="guide-cards directory">${cards(zhGuides,'zh')}</div><section class="directory-note"><h2>English guides</h2><p><a href="./en.html">Run Claude Code or Codex on a dedicated Mac mini in California ↗</a></p></section><section class="directory-note"><h2>这些指南回答什么？</h2><p>机器租金是否包含模型订阅、Claude Code 和 Codex 怎样准备与对比、远程连接要验证什么、老师怎样先跑通作品，以及推广佣金如何核对。各篇直接列出适用条件、具体准备和来源，不用示意内容冒充真实客户成果。</p><a href="../?lang=zh#partners">带着你的开发任务联系 WodeMac ↗</a></section>`, schema:collection(indexTitle, siteUrl+'/guides/', 'zh', zhGuides)}));

const enIndexTitle = 'Guides: Claude Code and Codex on a dedicated Mac mini';
writeFileSync(path.join(guideRoot,'en.html'), document({lang:'en', title:enIndexTitle, description:'How to run Claude Code and OpenAI Codex on a dedicated M6 Mac mini in California: setup, accounts, pricing, 24/7 agent runs and iOS builds without owning a Mac.', canonical:siteUrl+'/guides/en.html', alternate:{lang:'zh-CN',href:siteUrl+'/guides/'}, body:`<header class="article-head"><p class="eyebrow">Your own Mac, in California, USA.</p><h1>${enIndexTitle}</h1><p class="answer">WodeMac rents dedicated Mac minis in California for software development and testing, with Claude Code and Codex preinstalled. Your AI accounts stay your own.</p><p class="updated">Reviewed: <time datetime="${verifiedDate}">${verifiedDate}</time></p></header><div class="guide-cards directory">${cards(enGuides,'en')}</div><section class="directory-note"><h2>中文指南</h2><p><a href="./">查看全部中文指南 ↗</a></p></section>`, schema:collection(enIndexTitle, siteUrl+'/guides/en.html', 'en', enGuides)}));

const urls = [[siteUrl+'/',homeUpdated],[siteUrl+'/en.html',homeUpdated],[siteUrl+'/guides/',latest],[siteUrl+'/guides/en.html',latest],...guides.map(g=>[urlFor(g),dateOf(g)]),...['terms.html','terms.en.html','privacy.html','privacy.en.html'].map(p=>[siteUrl+'/legal/'+p,verifiedDate])];
writeFileSync(path.join(publicRoot,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(([url,date])=>`  <url><loc>${esc(url)}</loc><lastmod>${date}</lastmod></url>`).join('\n')}\n</urlset>\n`);

const plans = SALE_INTERVALS.map(key => `${billingLabel(key, true)} ${money(BILLING_PLANS[key].amountCents)}`).join(', ');
const line = g => `- [${g.title}](${urlFor(g)}): ${g.description}`;
writeFileSync(path.join(publicRoot,'llms.txt'),`# WodeMac\n\n> WodeMac (wodemac.com) rents dedicated Mac minis hosted in California for software development and testing, with Claude Code and OpenAI Codex preinstalled. Third-party AI accounts and model subscriptions are separate and must meet their providers' eligibility rules.\n\nThis file is a maintained document directory, not a promise of search indexing or AI citations.\n\n## Key facts\n- ${facts.en}\n- Plans (USD, paid upfront, machine only): ${plans}. Annual orders of 5 or more Macs get 2.5% off the first year.\n- Typical users: teams shipping products overseas; game, short-drama and AI video studios running scripts and builds overnight; students and parents; AI teachers and their classes.\n- Access: the same Mac can be controlled from a phone or iPad (browser) and a computer (WodeMac Mac App or browser); tasks keep running when devices change or disconnect.\n- Operator: WodeMac Inc, California, USA.\n- Full text of the guides: ${siteUrl}/llms-full.txt\n\n## Official information\n- [Chinese homepage](${siteUrl}/): Configuration, current plans, delivery and support.\n- [English homepage](${siteUrl}/en.html): English product information.\n\n## Guides (English)\n${enGuides.map(line).join('\n')}\n\n## 中文指南\n${zhGuides.map(line).join('\n')}\n\n## Legal\n- [Terms](${siteUrl}/legal/terms.html): Contract, billing, use and referral rules.\n- [Privacy](${siteUrl}/legal/privacy.html): Data and privacy information.\n\nVerified: ${verifiedDate}. Current configuration, stock and terms take precedence over this directory.\n`);

const plain = html => html.replace('{{PRICE_TABLE}}', `\n${SALE_INTERVALS.map(key => `- ${billingLabel(key, true)}: ${money(BILLING_PLANS[key].amountCents)} for ${BILLING_PLANS[key].months} month(s)`).join('\n')}\n`).replace(/<li>/g, '\n- ').replace(/<\/p>/g, '\n\n').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\n{3,}/g, '\n\n').trim();
writeFileSync(path.join(publicRoot,'llms-full.txt'),`# WodeMac — full guide text\n\n> ${facts.en}\n\nSource: ${siteUrl}/ · Verified ${verifiedDate}. Current configuration, prices and terms on wodemac.com take precedence.\n\n${guides.map(g => `---\n\n## ${g.title}\n\nURL: ${urlFor(g)}\n\n${g.answer}\n\n${g.sections.map(([h, html]) => `### ${h}\n\n${plain(html)}`).join('\n\n')}\n\n### ${langOf(g) === 'en' ? 'FAQ' : '常见问题'}\n\n${g.faqs.map(([q, a]) => `**${q}**\n${a}`).join('\n\n')}\n`).join('\n')}`);
// Search engine ownership files. The production build copies only an allowlist of root files,
// so they are written here, where the build runs. Removing one drops that verification.
for (const name of ['google56101fb62f40fa0c.html']) writeFileSync(path.join(publicRoot, name), `google-site-verification: ${name}`);
console.log(`Generated ${guides.length} guides (${zhGuides.length} zh, ${enGuides.length} en), two directories, sitemap, llms.txt and llms-full.txt.`);
