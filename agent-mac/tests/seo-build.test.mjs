import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import test from 'node:test';
import { guides } from '../scripts/seo-content.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const build=path.join(root,'dist/client');
const read=relative=>readFileSync(path.join(build,relative),'utf8');
const text=html=>html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'').replace(/<[^>]*>/g,'').replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/\s+/g,' ').trim();
const graphs=html=>[...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].flatMap(match=>JSON.parse(match[1])['@graph']??[]);
const guideFiles=['index.html','en.html',...guides.map(guide=>guide.slug+'.html')];

test('both built homepages contain the real landing content before JavaScript',()=>{
  for(const [file,lang,heading,canonical] of [
    ['index.html','zh-CN','我的 Mac，','https://wodemac.com/'],
    ['en.html','en','Your own Mac,','https://wodemac.com/en.html'],
  ]){
    const html=read(file);
    assert.ok(html.length>30000);
    assert.ok(html.includes(`<html lang="${lang}">`));
    assert.equal([...html.matchAll(/<h1[\s>]/g)].length,1);
    assert.ok(html.includes(heading));
    assert.ok(html.includes(`rel="canonical" href="${canonical}"`));
    assert.ok(html.includes('hreflang="zh-CN"'));
    assert.ok(html.includes('hreflang="en"'));
    assert.ok(html.includes(file==='en.html'?'href="./guides/en.html"':'href="./guides/"'));
    assert.ok(html.includes('data-prerendered='));
    assert.ok(html.includes('type="module"'));
    assert.ok(html.includes('data-stock-pending'));
    assert.ok(!html.includes('class="hm-stock-bar"><i style="width:68%"'));
    assert.ok(html.includes(englishDescription(file)));
    assert.ok(!html.includes('首发 100 台已租出 68 台'));
    assert.ok(!html.includes('68 of the first 100 are rented'));
    assert.ok(!html.includes('aria-valuenow="68"'));
    const faq=graphs(html).find(item=>item['@type']==='FAQPage');
    assert.ok(faq.mainEntity.length>=5);
    const visible=text(html);
    for(const item of faq.mainEntity){
      assert.ok(visible.includes(item.name),item.name);
      assert.ok(visible.includes(item.acceptedAnswer.text),item.name);
    }
  }
});

function englishDescription(file){
  return file==='en.html'?'Dedicated Mac mini rentals in California for software development':'wodeMac 提供美国加州独享 Mac mini 租赁';
}

test('pre-rendered payment links preserve period and language and show real upfront charges',()=>{
  for(const [file,language] of [['index.html','zh'],['en.html','en']]){
    const html=read(file);
    const links=[...html.matchAll(/href="([^\"]*view=checkout[^\"]*)"/g)].map(match=>new URL(match[1].replace(/&amp;/g,'&'),'https://wodemac.com/'));
    assert.equal(links.length,4);
    assert.deepEqual(links.map(link=>link.searchParams.get('interval')),['month','quarter','half','year']);
    assert.ok(links.every(link=>link.searchParams.get('lang')===language));
    for(const amount of ['$169','$481.65','$912.60','$1,723.80'])assert.ok(html.includes(amount),amount);
  }
});

test('guides are static, internally reachable, and their FAQ data matches visible answers',()=>{
  for(const file of guideFiles){
    const html=read('guides/'+file);
    const english=file==='en.html'||guides.find(guide=>guide.slug+'.html'===file)?.lang==='en';
    assert.equal([...html.matchAll(/<h1[\s>]/g)].length,1);
    assert.ok(html.includes(english?'<html lang="en">':'<html lang="zh-CN">'));
    assert.ok(html.includes('name="description"'));
    assert.ok(html.includes('https://wodemac.com/guides/'+(file==='index.html'?'':file)));
    if(/claude|codex|ios/.test(file))assert.ok(/Claude Code|Codex/.test(html));
    assert.ok(!html.includes('{{PRICE_TABLE}}'));
    assert.ok(!html.includes('fonts.googleapis.com'));
    const visible=text(html);
    const graph=graphs(html);
    assert.ok(graph.some(item=>item['@type']==='Organization'&&item.name==='wodeMac'));
    const faq=graph.find(item=>item['@type']==='FAQPage');
    if(file!=='index.html'&&file!=='en.html')assert.ok(faq?.mainEntity.length>=3);
    for(const item of faq?.mainEntity??[]){
      assert.ok(visible.includes(item.name));
      assert.ok(visible.includes(item.acceptedAnswer.text));
    }
    for(const match of html.matchAll(/(?:href|src)="([^\"]+)"/g)){
      const url=new URL(match[1],'https://wodemac.com/guides/'+file);
      if(url.origin!=='https://wodemac.com')continue;
      const relative=url.pathname.endsWith('/')?url.pathname+'index.html':url.pathname;
      assert.ok(existsSync(path.join(build,relative)),`${file}: ${url.pathname}`);
    }
  }
});

function runLocale(href){
  const calls={replaced:[],history:[],attributes:[],metas:[]};
  const document={documentElement:{setAttribute:(...args)=>calls.attributes.push(args)},createElement:()=>({}),head:{append:meta=>calls.metas.push(meta)}};
  const window={location:{href,replace:url=>calls.replaced.push(String(url))},history:{replaceState:(_state,_title,url)=>calls.history.push(String(url))}};
  vm.runInNewContext(read('seo-locale.js'),{window,document,URL});
  return calls;
}
test('legacy English landing links keep referral, interval and anchor while reaching English HTML',()=>{
  const result=runLocale('https://wodemac.com/?lang=en&interval=quarter&ref=ABCDEF123456#faq');
  assert.equal(result.replaced.length,1);
  const url=new URL(result.replaced[0]);
  assert.equal(url.pathname,'/en.html');
  assert.equal(url.searchParams.get('lang'),'en');
  assert.equal(url.searchParams.get('interval'),'quarter');
  assert.equal(url.searchParams.get('ref'),'ABCDEF123456');
  assert.equal(url.hash,'#faq');
  const direct=runLocale('https://wodemac.com/en.html?interval=half#pricing');
  assert.equal(new URL(direct.history[0]).searchParams.get('lang'),'en');
});
test('account and checkout URLs do not navigate through the English landing redirect',()=>{
  for(const href of ['https://wodemac.com/?view=checkout&lang=en&interval=quarter','https://wodemac.com/?view=orders&lang=en','https://wodemac.com/checkout?lang=en']){
    const result=runLocale(href);
    assert.equal(result.replaced.length,0);
    assert.equal(result.history.length,0);
    assert.deepEqual(result.attributes,[['data-app-route','']]);
    assert.equal(result.metas[0].content,'noindex,follow');
  }
});
test('sitemap describes only published content paths and robots exposes it',()=>{
  const sitemap=read('sitemap.xml');
  const urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match=>new URL(match[1]));
  assert.equal(new Set(urls.map(String)).size,urls.length);
  assert.ok(urls.some(url=>url.pathname==='/en.html'));
  assert.ok(!sitemap.includes('?lang=en'));
  assert.ok(!sitemap.includes('view='));
  for(const url of urls){
    assert.equal(url.origin,'https://wodemac.com');
    assert.ok(existsSync(path.join(build,url.pathname.endsWith('/')?url.pathname+'index.html':url.pathname)),url.pathname);
  }
  assert.ok(read('robots.txt').includes('Sitemap: https://wodemac.com/sitemap.xml'));
  for(const file of guideFiles.filter(file=>file!=='index.html'&&file!=='en.html'))assert.ok(read('llms.txt').includes('/guides/'+file));
  const full=read('llms-full.txt');
  for(const guide of guides)assert.ok(full.includes(guide.answer),guide.slug);
  assert.ok(!full.includes('{{PRICE_TABLE}}'));
});
