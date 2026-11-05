import { forwardRef, memo, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import sourceZh from './source.html?raw';
import sourceEn from './source.en.html?raw';
import {CommerceProvider, appHref, isDemo, onMarketingHost} from './commerce/context.jsx';
import {VIEWS} from './commerce/core.mjs';
import {BILLING_PLANS,BULK_MIN_QUANTITY,MAX_QUANTITY,PLAN_DISCOUNTS,normalizeInterval,dailyCents,monthlyEquivalentCents,orderAmounts,readQuantity,saveQuantity} from './commerce/plans.mjs';
import {AccountEntry, CommercePages, CheckoutAction} from './commerce/pages.jsx';
const english = new URLSearchParams(location.search).get('lang') === 'en';
const language = english ? 'en' : 'zh';
const t = (zh, en) => english ? en : zh;
const source = english ? sourceEn : sourceZh;

const SourceMarkup = memo(forwardRef(function SourceMarkup(_, ref) { return <div ref={ref} dangerouslySetInnerHTML={{__html:source}} />; }));

const plans = {
  month: { name: t('月付','Monthly'), title: t('月付','Monthly'), unit: t('月','month'), summary: t('每月支付 $169','$169 billed monthly'), term: t('随时取消续订，当期结束后停止','Cancel renewal anytime; service ends after the current period') },
  quarter: { name: t('季付','Quarterly'), title: t('季付','Quarterly'), unit: t('季','quarter'), summary: t('一次支付 $481.65，享用 3 个月','$481.65 paid upfront for 3 months'), term: t('每 3 个月续订，可随时关闭下期续订','Renews every 3 months; turn off next renewal anytime') },
  half: { name: t('半年付','Half-yearly'), title: t('半年付','Half-yearly'), unit: t('半年','half-year'), summary: t('一次支付 $912.60，享用 6 个月','$912.60 paid upfront for 6 months'), term: t('每 6 个月续订，可随时关闭下期续订','Renews every 6 months; turn off next renewal anytime') },
  year: { name: t('年付','Yearly'), title: t('年付','Yearly'), unit: t('年','year'), summary: t('一次支付 $1,723.80，享用 12 个月','$1,723.80 paid upfront for 12 months'), term: t('年付一次付清，一年内不能取消或退款','Yearly is paid upfront and is non-refundable during the year') },
};
for(const [key,plan] of Object.entries(plans))Object.assign(plan,{...BILLING_PLANS[key],display:(BILLING_PLANS[key].monthlyCents??BILLING_PLANS[key].amountCents)/100,total:BILLING_PLANS[key].amountCents/100});
const paymentLink = interval => appHref('checkout',{interval});

const money = cents => '$' + (cents / 100).toLocaleString('en-US', { minimumFractionDigits: cents % 100 ? 2 : 0 });
const Amount = ({ cents }) => <>{'$' + Math.floor(cents / 100).toLocaleString('en-US')}{cents % 100 ? <small>{'.' + String(cents % 100).padStart(2, '0')}</small> : null}</>;
function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [links, setLinks] = useState([]);
  useEffect(() => { setLinks([...document.querySelectorAll('.caldock-page-links a')].map(link => ({ href: link.getAttribute('href'), label: link.textContent }))); }, []);
  useEffect(() => {
    document.documentElement.classList.toggle('wm-menu-open', open);
    if (!open) return;
    const close = event => { if (event.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', close);
    return () => { window.removeEventListener('keydown', close); document.documentElement.classList.remove('wm-menu-open'); };
  }, [open]);
  return <>
    <button type="button" className={'wm-menu-toggle' + (open ? ' is-open' : '')} aria-expanded={open} aria-controls="wm-menu-panel" aria-label={open ? t('关闭菜单','Close menu') : t('打开菜单','Open menu')} onClick={() => setOpen(value => !value)}><i /><i /></button>
    {createPortal(<nav id="wm-menu-panel" className={'wm-menu-panel' + (open ? ' is-open' : '')} aria-label={t('页面导航','Page navigation')} inert={!open}>
      <button type="button" className="wm-menu-toggle wm-menu-close is-open" aria-label={t('关闭菜单','Close menu')} onClick={() => setOpen(false)}><i /><i /></button>
      {links.map((link, index) => <a key={link.href} href={link.href} style={{ '--i': index }} onClick={() => setOpen(false)}>{link.label}</a>)}
    </nav>, document.body)}
  </>;
}

// Reveals the tagline one word at a time as it crosses a line in the viewport.
// The stock in the page source is only the fallback; the server counts paid orders.
function paintStock(page, { total, rented, left }) {
  const label = left ? t('首发 ' + total + ' 台已租出 ' + rented + ' 台，仅剩 ' + left + ' 台', rented + ' of ' + total + ' launch Macs rented, ' + left + ' available') : t('首发 ' + total + ' 台已全部租出', 'All ' + total + ' launch Macs are rented');
  page.querySelectorAll('.afterglow-stock, .hm-closing-stock').forEach(meter => { meter.setAttribute('aria-label', label); meter.setAttribute('aria-valuemax', total); meter.setAttribute('aria-valuenow', rented); });
  const hero = page.querySelector('.afterglow-stock');
  if (hero) {
    // The ten marks show the share rented, so they never read as full while a Mac is left.
    const filled = left ? Math.min(9, Math.round(rented / total * 10)) : 10;
    hero.style.setProperty('--hm-board-size', total); hero.style.setProperty('--hm-board-left', left); hero.style.setProperty('--hm-board-taken', filled);
    hero.querySelector('.afterglow-stock-heading span:last-child').textContent = left ? t('已租出 ' + rented + ' 台', rented + ' already rented') : t('已全部租出', 'All rented');
    if (!left) hero.querySelector('.afterglow-stock-bottom p span').textContent = t('剩余', '');
    hero.querySelectorAll('.afterglow-stock-marks i').forEach((mark, index) => mark.toggleAttribute('data-available', index >= filled));
  }
  const copy = page.querySelector('[data-stock-copy]');
  if (copy) copy.textContent = left ? t('首发 ' + total + ' 台已租出 ' + rented + ' 台，仅剩 ' + left + ' 台。', rented + ' of the first ' + total + ' are rented. Only ' + left + ' remain' + (left === 1 ? 's' : '') + '. ') : t('首发 ' + total + ' 台已全部租出。', 'All ' + total + ' launch Macs are rented. ');
  const figure = page.querySelector('.hm-closing-stock .hm-stock-figures strong');
  if (figure) figure.textContent = left ? t('仅剩 ' + left + ' 台', 'Only ' + left + ' left') : t('已全部租出', 'All rented');
  const bar = page.querySelector('.hm-closing-stock .hm-stock-bar i');
  if (bar) bar.style.width = rented / total * 100 + '%';
}
function useLiveStock(root, enabled) {
  useEffect(() => {
    if (!enabled) return;
    let live = true;
    fetch('/api/caldock/capabilities', { credentials: 'same-origin' }).then(r => r.ok ? r.json() : null).then(data => { if (live && data?.stock && root.current) paintStock(root.current, data.stock); }).catch(() => {});
    return () => { live = false; };
  }, [root, enabled]);
}
function useTaglineReveal(root, enabled) {
  useEffect(() => {
    const line = root.current?.querySelector('[data-tagline]');
    if (!enabled || !line || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!line.dataset.split) {
      line.dataset.split = '1';
      const segment = typeof Intl.Segmenter === 'function' ? new Intl.Segmenter(document.documentElement.lang || undefined, { granularity: 'word' }) : null;
      line.querySelectorAll(':scope > span').forEach(row => {
        const text = row.textContent, parts = segment ? [...segment.segment(text)].map(item => item.segment) : text.split(/(\s+)/);
        row.setAttribute('aria-label', text); row.textContent = '';
        parts.forEach(part => { const word = document.createElement('span'); word.textContent = part; word.className = 'wm-word'; word.setAttribute('aria-hidden', 'true'); row.append(word); });
      });
    }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-lit'); observer.unobserve(entry.target); } }), { rootMargin: '0px 0px -38% 0px' });
    line.querySelectorAll('.wm-word:not(.is-lit)').forEach(word => observer.observe(word));
    return () => observer.disconnect();
  }, [root, enabled]);
}

function CoffeeNote({ className, zh, en }) {
  return <em className={'coffee-note ' + className}><svg aria-hidden="true" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 6.5h9v4a3 3 0 0 1-3 3h-3a3 3 0 0 1-3-3z"/><path d="M11.5 7.5h1a1.75 1.75 0 0 1 0 3.5h-1.1"/><path d="M5.5 1.5v2.5M8.5 1.5v2.5"/></svg>{t(zh, en)}</em>;
}

function HeroPrice() {
  const total = BILLING_PLANS.year.amountCents;
  return <><span>{t('','From ')}<strong><Amount cents={dailyCents(total, 'year')}/></strong>{t('/天起','/day')}<CoffeeNote className="coffee-note-hero" zh="每天一杯咖啡钱" en="About a coffee a day"/></span><small>{t('年付 ' + PLAN_DISCOUNTS.year + '% off，一次 ' + money(total), PLAN_DISCOUNTS.year + '% off yearly: ' + money(total) + ' billed annually')}</small></>;
}

function QuantityStepper({ value, onChange }) {
  const set = next => onChange(saveQuantity(next));
  return <div className="rental-quantity" role="group" aria-label={t('购买台数','Number of Macs')}>
    <span className="rental-quantity-label">{t('台数','QUANTITY')}</span>
    <div className="rental-quantity-control">
      <button type="button" aria-label={t('减少 1 台','One fewer')} disabled={value <= 1} onClick={() => set(value - 1)}>−</button>
      <input type="number" inputMode="numeric" min="1" max={MAX_QUANTITY} aria-label={t('台数','Number of Macs')} value={value} onChange={event => set(event.target.value)} />
      <button type="button" aria-label={t('增加 1 台','One more')} disabled={value >= MAX_QUANTITY} onClick={() => set(value + 1)}>+</button>
    </div>
  </div>;
}
// What the buyer saves and, for a bulk order, what renewals cost afterwards.
function orderNote(interval, quantity) {
  const { subtotal, bulkOff, total } = orderAmounts(interval, quantity), saved = monthlyEquivalentCents(interval, quantity) - total;
  const parts = [];
  if (quantity > 1) parts.push(money(BILLING_PLANS[interval].amountCents) + ' × ' + quantity + t(' 台',' Macs'));
  if (saved > 0) parts.push(t('比连续月付省 ','Save ') + money(saved) + t('',' versus paying monthly'));
  if (bulkOff) parts.push(t('含首年再减 2.5%，续费每期 ','Includes 2.5% off the first year; renews at ') + money(subtotal));
  else if (interval === 'year' && quantity < BULK_MIN_QUANTITY) parts.push(t('买满 ' + BULK_MIN_QUANTITY + ' 台，首年再减 2.5%','Buy ' + BULK_MIN_QUANTITY + ' or more for a further 2.5% off the first year'));
  return parts.length ? parts.join(t('；',' · ')) : t('按月续订，随时可停','Month to month. Cancel renewal anytime.');
}

function PlanPicker({ value, onChange, id }) {
  const plan = plans[value];
  // The plan section always starts at one Mac; the number chosen here carries on to checkout and sign-in.
  const [quantity, setQuantity] = useState(() => saveQuantity(1));
  const amounts = orderAmounts(value, quantity);
  return <section className="rental-plan" aria-label={t("选择付款方案","Choose your billing plan")}>
    <fieldset className="rental-options"><legend className="sr-only">{t("付款周期","Billing period")}</legend>
      {Object.entries(plans).map(([key,p]) => <label className={'rental-option rental-plan-card ' + (value === key ? 'is-selected ' : '') + (key === 'year' ? 'is-annual' : '')} key={key}>
        <input type="radio" name={'billing-'+id} value={key} checked={value === key} onChange={() => onChange(key)} />
        {key === 'year' && <em className="rental-card-flag">{t('推荐','Recommended')}</em>}
        <span className="rental-card-top"><span className="rental-radio" aria-hidden="true">{value === key && <img src="./assets/check.svg" alt="" />}</span><span className="rental-card-heading">{p.title}</span><em className={'rental-card-off' + (PLAN_DISCOUNTS[key] ? '' : ' is-plain')}>{PLAN_DISCOUNTS[key] ? PLAN_DISCOUNTS[key] + '% OFF' : t('标准价','Standard')}</em></span>
        <span className="rental-card-price"><strong><Amount cents={dailyCents(BILLING_PLANS[key].amountCents,key)}/></strong><span>{t('/天','/day')}</span>{PLAN_DISCOUNTS[key] && <s><Amount cents={dailyCents(BILLING_PLANS.month.amountCents,'month')}/></s>}</span>
        <span className="rental-card-charge"><b>{money(BILLING_PLANS[key].amountCents)}</b><small>{BILLING_PLANS[key].months===1?t('/ 月','/ month'):t('/ '+BILLING_PLANS[key].months+' 个月','/ '+BILLING_PLANS[key].months+' months')}</small></span>
        <span className="rental-card-save">{PLAN_DISCOUNTS[key]?<>{t('比月付省 ','Save ')}<b>{money(monthlyEquivalentCents(key)-BILLING_PLANS[key].amountCents)}</b>{t('',' vs monthly')}</>:t('按月续订，随时可停','Cancel renewal anytime')}</span>
      </label>)}
    </fieldset>
    <div className="rental-action-bar"><p className="rental-selection" aria-live="polite"><span className="rental-selection-label">{t("已选方案","YOUR SELECTION")}</span><span className="rental-selection-main"><span>{plan.name}{PLAN_DISCOUNTS[value]?' · '+PLAN_DISCOUNTS[value]+'% OFF':''}</span><b>{money(amounts.total)}</b><small>{plan.months===1?t('/ 月','/ month'):t('/ '+plan.months+' 个月','/ '+plan.months+' months')}</small></span><span className="rental-selection-sub">{orderNote(value, quantity)}</span></p>
    <QuantityStepper value={quantity} onChange={setQuantity} />
    <a className="rental-pay-button" href={paymentLink(value)}><span>{t("继续付款","Continue to payment")}</span><i aria-hidden="true"><img src="./assets/chevron.svg" alt="" /></i></a></div>
    <ul className="rental-terms">
      <li><img src="./assets/check.svg" alt="" />{t("每天价格按一年 365 天折算，实际按所选周期一次付款","Daily prices assume a 365-day year; you pay once per billing period")}</li>
      <li><img src="./assets/check.svg" alt="" />{t("通常 24 小时内交付，最迟 3 个工作日，否则全额退款","Usually delivered within 24 hours; full refund if it takes over 3 business days")}</li>
      <li><img src="./assets/check.svg" alt="" /><span data-testid="plan-term">{plan.term}</span></li>
      <li><img src="./assets/check.svg" alt="" />{t("可一次买多台；年付一次买 5 台及以上，首年再减 2.5%","Buy as many as you need. Yearly orders of 5 or more get a further 2.5% off the first year")}</li>
    </ul>
  </section>;
}

function useSourceInteractions(root) {
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const picker = node.querySelector('.site-language-picker');
    const click = e => {
      const button = e.target.closest('[data-slot="collapsible-trigger"]');
      if (button) {
        const open = button.getAttribute('aria-expanded') !== 'true';
        const container = button.parentElement;
        const panel = container.querySelector('[data-slot="collapsible-content"]');
        button.setAttribute('aria-expanded', String(open));
        button.setAttribute('aria-controls', panel.id);
        for (const element of [container, button, panel]) {
          element.toggleAttribute('data-open', open);
          element.toggleAttribute('data-closed', !open);
        }
        button.toggleAttribute('data-panel-open', open);
        panel.hidden = !open;
      }
      if (e.target.closest('a[href^="#"]')) picker?.removeAttribute('open');
    };
    const escape = e => { if (e.key === 'Escape') picker?.removeAttribute('open'); };
    const dismiss = e => { if (!e.target.closest('.site-language-picker')) picker?.removeAttribute('open'); };
    node.addEventListener('click', click);
    document.addEventListener('keydown', escape);
    document.addEventListener('click', dismiss);
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in-view');observer.unobserve(entry.target); } });
    }, { threshold: 0.06 });
    node.querySelectorAll('.site-reveal-group').forEach(element => {
      element.classList.add('site-reveal-animated');observer.observe(element);
    });
    let disposed = false;
    document.fonts.ready.then(() => requestAnimationFrame(() => {
      if (disposed || !location.hash) return;
      const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      target?.scrollIntoView({ block:'start', behavior:'instant' });
    }));
    const anchors = [...node.querySelectorAll('.caldock-page-links a')];
    const activeSections = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        anchors.forEach(anchor => {
          if (anchor.getAttribute('href') === '#'+entry.target.id) anchor.setAttribute('aria-current','location');
          else anchor.removeAttribute('aria-current');
        });
      }
    }, { rootMargin:'-15% 0px -65% 0px', threshold:0 });
    anchors.forEach(anchor => { const section = node.querySelector(anchor.getAttribute('href')); if (section) activeSections.observe(section); });
    return () => {
      node.removeEventListener('click',click);document.removeEventListener('keydown',escape);document.removeEventListener('click',dismiss);
      disposed = true;observer.disconnect();activeSections.disconnect();
    };
  }, [root]);
}

function Checkout({ value }) {
  const plan = plans[value];
  const [quantity, setQuantity] = useState(readQuantity);
  const amounts = orderAmounts(value, quantity);
  return <div className="checkout-page">
    <header className="checkout-nav"><a className="checkout-brand" href={appHref()}><img className="brand-wordmark" src="./assets/wodemac-logo.png" alt="wodeMac" /></a><a href={appHref(undefined,{interval:value})+'#pricing'}>{t("返回选择方案","Back to plans")}</a></header>
    <main className="checkout-main">
      <section className="checkout-details"><p className="checkout-eyebrow">{t("独享 MAC · 美国加州","DEDICATED MAC · CALIFORNIA")}</p><h1>{t("完成付款，","Your own Mac,")}<br />{t("开启你的独享 Mac。","one payment away.")}</h1>
        <p className="checkout-lead">{t("M6 Mac mini，24 小时为你和 Agent 在线。","M6 Mac mini. Always on for you and your agents.")}</p>
        <div className="checkout-product"><img src="./assets/mac-portrait.svg" alt="M6 Mac mini" /><div><strong>{t("独享 Mac mini","Dedicated Mac mini")}</strong><span>{t("Apple M6 · 12 核 CPU · 12 核 GPU","Apple M6 · 12-core CPU · 12-core GPU")}</span><span>{t("16GB 统一内存 · 256GB SSD","16GB unified memory · 256GB SSD")}</span><span>{t("美国加州 · 整台独占","California, USA · Exclusively yours")}</span></div></div>
        <div className="checkout-service"><h2>{t("付款后会发生什么","What happens after payment")}</h2><p>{t("通常 24 小时内交付，最迟 3 个工作日，否则全额退款。计费从付款当天开始。","Usually delivered within 24 hours, and within 3 business days at the latest or you get a full refund. Billing starts on payment.")}</p><p>{t("你可以在账单页查看交付进度与登录信息。","Track delivery and sign-in details on your billing page.")}</p></div>
      </section>
      <section className="checkout-summary" aria-labelledby="order-title"><h2 id="order-title">{t("订单摘要","Order summary")}</h2><div className="checkout-order-line"><span>{t("独享 Mac mini","Dedicated Mac mini")} · {plan.name}{quantity > 1 ? ' × ' + quantity : ''}</span><strong>{money(amounts.subtotal)}</strong></div>
        <p className="checkout-cycle">{plan.summary}</p>
        {PLAN_DISCOUNTS[value] && <p className="checkout-saving">{plan.name} {PLAN_DISCOUNTS[value]}% OFF</p>}
        <p className="checkout-saving">{orderNote(value, quantity)}</p>
        <QuantityStepper value={quantity} onChange={setQuantity} />
        <dl><div><dt>{t("托管位置","Location")}</dt><dd>{t("美国加州","California, USA")}</dd></div><div><dt>{t("数量","Quantity")}</dt><dd>{quantity}{t(" 台",quantity===1?" Mac":" Macs")}</dd></div><div><dt>{t("计费周期","Billing period")}</dt><dd>{plan.months}{t(' 个月',plan.months===1?' month':' months')}</dd></div></dl>
        <div className="checkout-total"><span>{t("本次应付","Total due today")} <small>USD</small></span><strong><Amount cents={amounts.total}/></strong></div>
        <p className="checkout-policy">{plan.term}{t("。计费从付款当天开始。",". Billing starts on payment.")}</p>
        <p className="checkout-legal">{t("付款即表示你同意","By paying, you agree to the ")}<a href={t("./legal/terms.html","./legal/terms.en.html")}>{t("服务条款","Terms of Service")}</a>{t("和"," and ")}<a href={t("./legal/privacy.html","./legal/privacy.en.html")}>{t("隐私政策","Privacy Policy")}</a>{t("。",".")}</p>
        <CheckoutAction value={value} quantity={quantity}/>
        <a className="checkout-change" href={appHref(undefined,{interval:value})+'#pricing'}>{t("更改付款方案","Change billing plan")}</a>
      </section>
    </main>
  </div>;
}

function RentalApp() {
  const root = useRef(null);
  const [value,setValue] = useState(() => {
    const query = new URLSearchParams(location.search).get('interval');
    const saved = sessionStorage.getItem('rental-interval');
    return normalizeInterval(query,normalizeInterval(saved));
  });
  const [slots,setSlots] = useState([]);
  const [accountSlots,setAccountSlots] = useState([]); const [priceSlots,setPriceSlots] = useState([]); const [menuSlots,setMenuSlots] = useState([]);
  const checkout = location.pathname === '/checkout' || new URLSearchParams(location.search).get('view') === 'checkout';
  useTaglineReveal(root, !checkout);
  useLiveStock(root, !checkout);
  useSourceInteractions(root);
  useEffect(() => {
    sessionStorage.setItem('rental-interval',value);
    if (!checkout) { const url = new URL(location.href); url.searchParams.set('interval', value); history.replaceState(null, '', url); }
    if (!checkout) {
      setSlots([...root.current.querySelectorAll('[data-plan-slot]')]);
      setAccountSlots([...root.current.querySelectorAll('[data-account-slot]')]);
      setPriceSlots([...root.current.querySelectorAll('[data-hero-price-slot]')]);
      setMenuSlots([...root.current.querySelectorAll('[data-menu-slot]')]);
      root.current.querySelectorAll('[data-affiliate-link]').forEach(a => { a.href=appHref('affiliate'); });
      root.current.querySelectorAll('[data-language]').forEach(a => { a.href=appHref(undefined,{lang:a.dataset.language,interval:value}); });
      root.current.querySelector('.caldock-brand').href=appHref();
    }
  }, [value,checkout]);
  useEffect(() => { document.title = checkout ? t('付款 · wodeMac','Checkout · wodeMac') : t('我的 Mac，在美国加州 | wodeMac','Your own Mac, in California, USA | wodeMac'); document.documentElement.lang = english ? 'en' : 'zh-CN'; }, [checkout]);
  if (checkout) return <Checkout value={value} />;
  return <>
    <SourceMarkup ref={root} />
    {slots.map(slot => createPortal(<PlanPicker value={value} onChange={setValue} id={slot.dataset.planSlot} />,slot))}
    {accountSlots.map(slot=>createPortal(<AccountEntry/>,slot))}
    {priceSlots.map((slot,index)=>createPortal(<HeroPrice/>,slot,'price-'+index))}
    {menuSlots.map((slot,index)=>createPortal(<MobileMenu/>,slot,'menu-'+index))}
  </>;
}

function HostedAccountRedirect(){useEffect(()=>{const q=new URLSearchParams(location.search);location.replace(appHref(q.get('view'),{next:q.get('next')||undefined,tab:q.get('tab')||undefined,order:q.get('order')||undefined}));},[]);return <div className="cd-loading-page"><p>{t('正在打开安全账号中心…','Opening your account…')}</p></div>;}
export function App(){
  const view=new URLSearchParams(location.search).get('view');
  useEffect(()=>{document.documentElement.lang=english?'en':'zh-CN';if(VIEWS.has(view))document.title=(view==='admin'?t('管理后台','Operations'):view==='login'?t('登录','Sign in'):t('客户中心','My account'))+' · wodeMac';},[view]);
  const accountView=VIEWS.has(view);
  const needsAccountHost=onMarketingHost&&!isDemo&&(accountView||view==='checkout');
  return <CommerceProvider>{needsAccountHost?<HostedAccountRedirect/>:accountView?<CommercePages view={view}/>:<RentalApp/>}</CommerceProvider>;
}
