import { forwardRef, memo, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import sourceZh from './source.html?raw';
import sourceEn from './source.en.html?raw';
import {CommerceProvider, appHref, isDemo, onMarketingHost} from './commerce/context.jsx';
import {VIEWS} from './commerce/core.mjs';
import {BILLING_PLANS,normalizeInterval,dailyCents} from './commerce/plans.mjs';
import {AccountEntry, CommercePages, CheckoutAction} from './commerce/pages.jsx';
const english = new URLSearchParams(location.search).get('lang') === 'en';
const language = english ? 'en' : 'zh';
const t = (zh, en) => english ? en : zh;
const source = english ? sourceEn : sourceZh;

const SourceMarkup = memo(forwardRef(function SourceMarkup(_, ref) { return <div ref={ref} dangerouslySetInnerHTML={{__html:source}} />; }));

const plans = {
  week: { name: t('周付','Weekly'), title: t('周付','Weekly'), unit: t('周','week'), summary: t('每周支付 $69','$69 billed weekly'), term: t('随时取消续订，当期结束后停止','Cancel renewal anytime; service ends after the current period') },
  month: { renews: t('之后每月 $199','Then $199 per month'), name: t('月付','Monthly'), title: t('月付','Monthly'), unit: t('月','month'), summary: t('每月支付 $199','$199 billed monthly'), term: t('随时取消续订，当期结束后停止','Cancel renewal anytime; service ends after the current period') },
  quarter: { renews: t('之后每 3 个月 $537','Then $537 every 3 months'), name: t('季付','Quarterly'), title: t('季付','Quarterly'), unit: t('季','quarter'), summary: t('一次支付 $537，享用 3 个月','$537 paid upfront for 3 months'), term: t('每 3 个月续订，可随时关闭下期续订','Renews every 3 months; turn off next renewal anytime') },
  half: { renews: t('之后每 6 个月 $954','Then $954 every 6 months'), name: t('半年付','Half-yearly'), title: t('半年付','Half-yearly'), unit: t('半年','half-year'), summary: t('一次支付 $954，享用 6 个月','$954 paid upfront for 6 months'), term: t('每 6 个月续订，可随时关闭下期续订','Renews every 6 months; turn off next renewal anytime') },
  year: { renews: t('之后每年 $1,668','Then $1,668 per year'), name: t('年付','Yearly'), title: t('年付','Yearly'), unit: t('年','year'), summary: t('一次支付 $1,668，享用 12 个月','$1,668 paid upfront for 12 months'), term: t('年付一次付清，一年内不能取消或退款','Yearly is paid upfront and is non-refundable during the year') },
};
for(const [key,plan] of Object.entries(plans))Object.assign(plan,{...BILLING_PLANS[key],display:(BILLING_PLANS[key].monthlyCents??BILLING_PLANS[key].amountCents)/100,total:BILLING_PLANS[key].amountCents/100});
const dollars = n => '$' + n.toLocaleString('en-US');
const savings = { quarter: { zh: '三个月', en: '3 monthly payments', amount: 60 }, half: { zh: '半年', en: '6 monthly payments', amount: 240 }, year: { zh: '一年', en: '12 monthly payments', amount: 720 } };
const paymentLink = interval => appHref('checkout',{interval});

const money = cents => '$' + (cents / 100).toLocaleString('en-US', { minimumFractionDigits: cents % 100 ? 2 : 0 });
const clock = ms => { const s = Math.max(0, Math.ceil(ms / 1000)); return [s / 3600, s / 60 % 60, s % 60].map(n => String(Math.floor(n)).padStart(2, '0')).join(':'); };
// The reset time is fixed: midnight Beijing time. Seats left only ever come from the server; without it they stay unknown.
const BEIJING_OFFSET = 8 * 3600000;
const nextBeijingMidnight = now => new Date(Math.floor((now + BEIJING_OFFSET) / 86400000 + 1) * 86400000 - BEIJING_OFFSET).toISOString();
function useDailyOffer() {
  const [server, setServer] = useState(undefined);
  const [now, setNow] = useState(() => Date.now());
  const load = useCallback(() => fetch('/api/caldock/capabilities', { credentials: 'same-origin' }).then(r => r.ok ? r.json() : undefined).then(data => setServer(data && (data.offer || null))).catch(() => setServer(undefined)), []);
  useEffect(() => { load(); const timer = setInterval(() => setNow(Date.now()), 1000), refresh = setInterval(load, 60000); return () => { clearInterval(timer); clearInterval(refresh); }; }, [load]);
  const expired = server && Date.parse(server.resetsAt) <= now;
  useEffect(() => { if (expired) load(); }, [expired, load]);
  // null: the backend answered and the offer is switched off.
  if (server === null) return null;
  const offer = server && !expired ? server : { percentOff: 20, seatsTotal: 3, seatsLeft: null, resetsAt: nextBeijingMidnight(now), excludedIntervals: ['week'] };
  return { ...offer, remaining: Date.parse(offer.resetsAt) - now };
}
const offerApplies = (offer, interval) => !!offer && offer.seatsLeft !== 0 && !offer.excludedIntervals.includes(interval);
const discounted = (offer, cents) => Math.round(cents * (100 - offer.percentOff) / 100);
const offerCents = (offer, interval) => discounted(offer, BILLING_PLANS[interval].amountCents);
const Amount = ({ cents }) => <>{'$' + Math.floor(cents / 100).toLocaleString('en-US')}{cents % 100 ? <small>{'.' + String(cents % 100).padStart(2, '0')}</small> : null}</>;
function OfferBar({ offer, value }) {
  if (!offer) return null;
  const full = offer.seatsLeft === 0;
  return <div className={'rental-offer' + (full ? ' is-full' : '')}>
    <strong className="rental-offer-title">{t('每日 ' + offer.seatsTotal + ' 台 · 限时 8 折', offer.seatsTotal + ' seats a day · limited-time 20% off')}</strong>
    <div className="rental-offer-timer"><span>{full ? t('今日名额已满，下一轮开放倒计时','Today\'s seats are gone. Next seats open in') : t('距今日名额重置还有','Seats reset in')}</span><time className="rental-offer-clock" dateTime={offer.resetsAt}>{clock(offer.remaining)}</time></div>
    <p>{value === 'week' ? t('周付不参加此优惠。','Weekly is not included. ') : ''}{t('限月付、季付、半年付、年付，续费恢复原价。每天北京时间 0 点重置，打开付款页时占用 1 台，30 分钟内未付款自动释放。','For monthly, quarterly, half-yearly and yearly plans. Renewals are at the regular price. Resets at midnight Beijing time. Opening the payment page holds a seat, released after about 30 minutes if unpaid.')}</p>
  </div>;
}

// The lowest price anyone can pay right now: yearly, 20% off the first year while a seat is left.
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
  page.querySelectorAll('.afterglow-stock, .hm-closing-stock').forEach(meter => { meter.setAttribute('aria-label', label); meter.setAttribute('aria-valuenow', rented); });
  const hero = page.querySelector('.afterglow-stock');
  if (hero) {
    hero.style.setProperty('--hm-board-left', left); hero.style.setProperty('--hm-board-taken', rented);
    hero.querySelector('.afterglow-stock-heading span:last-child').textContent = left ? t('已租出 ' + rented + ' 台', rented + ' already rented') : t('已全部租出', 'All rented');
    if (!left) hero.querySelector('.afterglow-stock-bottom p span').textContent = t('剩余', '');
    hero.querySelectorAll('.afterglow-stock-marks i').forEach((mark, index) => mark.toggleAttribute('data-available', index >= rented));
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

function HeroPrice() {
  const offer = useDailyOffer();
  const total = BILLING_PLANS.year.amountCents, list = dailyCents(total, 'year');
  if (!offerApplies(offer, 'year')) return <><span>{t('','From ')}<strong><Amount cents={list}/></strong>{t('/天起','/day')}</span><small>{t('按年付费，一次 ' + money(total), money(total) + ' billed annually')}</small></>;
  const first = offerCents(offer, 'year');
  return <><span>{t('','From ')}<s><Amount cents={list}/></s> <strong><Amount cents={dailyCents(first, 'year')}/></strong>{t('/天起','/day')}</span><small>{t('年付限时 8 折，首期一次 ' + money(first) + '，之后每年 ' + money(total), 'Limited-time 20% off: first year ' + money(first) + ' billed once, then ' + money(total) + ' per year')}</small></>;
}

function HeroOffer() {
  const offer = useDailyOffer();
  if (!offer) return null;
  const seats = offer.seatsLeft === 0 ? t('今日已满','Sold out today') : t('北京时间 0 点重置','Resets at midnight Beijing time');
  return <a className="afterglow-offer" href="#pricing">
    <div className="afterglow-stock-heading"><span>{t('每日 3 台 · 限时 8 折','3 seats a day · limited-time 20% off')}</span><span>{seats}</span></div>
    <div className="afterglow-stock-bottom"><p><span>{t('距重置','Resets in')}</span><time className="afterglow-offer-clock" dateTime={offer.resetsAt}>{clock(offer.remaining)}</time></p></div>
  </a>;
}

function CheckoutOffer({ offer, value }) {
  if (!offerApplies(offer, value)) return null;
  return <p className="checkout-saving">{t('每日 3 台限时 8 折，仅限首期。','3 seats a day get a limited-time 20% off, first period only. ')}{plans[value].renews}{t('。当天 3 台用完时按原价，以付款页金额为准。','. If seats run out the regular price applies; the payment page shows the final amount.')}</p>;
}

function PlanPicker({ value, onChange, id }) {
  const plan = plans[value];
  const offer = useDailyOffer();
  return <section className="rental-plan" aria-label={t("选择付款方案","Choose your billing plan")}>
    <OfferBar offer={offer} value={value} />
    <fieldset className="rental-options"><legend className="sr-only">{t("付款周期","Billing period")}</legend>
      {Object.entries(plans).map(([key,p]) => <label className={'rental-option rental-plan-card ' + (value === key ? 'is-selected ' : '') + (key === 'year' ? 'is-annual' : '')} key={key}>
        <input type="radio" name={'billing-'+id} value={key} checked={value === key} onChange={() => onChange(key)} />
        <span className="rental-card-edition" aria-hidden="true">{key==='week'?'01 / WEEKLY':key==='month'?'02 / MONTHLY':key==='quarter'?'03 / QUARTERLY':key==='half'?'04 / HALF-YEARLY':'05 / ANNUAL'}</span>
        <span className="rental-card-heading">{p.title}{key === 'year' && <em>{t('推荐','Recommended')}</em>}</span>
        <span className="rental-card-was">{offerApplies(offer,key)&&<><s><Amount cents={dailyCents(BILLING_PLANS[key].amountCents,key)}/></s><em>{t('限时 8 折','Limited-time 20% off')}</em></>}</span>
        <span className="rental-card-price"><strong><Amount cents={dailyCents(offerApplies(offer,key)?offerCents(offer,key):BILLING_PLANS[key].amountCents,key)}/></strong><span>{t('/天','/day')}</span></span>
        <span className="rental-card-total">{offerApplies(offer,key)?<>{t('首期支付 ','First period ')}{money(discounted(offer,BILLING_PLANS[key].amountCents))}<small>{p.renews}</small></>:p.summary}</span>
        {savings[key]?<span className="rental-card-note rental-card-saving"><span>{t('比连续月付'+savings[key].zh+'省','Save versus '+savings[key].en)}</span><b>${savings[key].amount}</b></span>:<span className="rental-card-note">{key==='week'?t('按周续订，随时可停','Week to week. Cancel renewal anytime.'):t('按月续订，随时可停','Month to month. Cancel renewal anytime.')}</span>}
        <span className="rental-card-select"><span className="rental-radio" aria-hidden="true">{value === key && <img src="./assets/check.svg" alt="" />}</span>{value===key?t('已选方案','Selected plan'):t('选择'+p.name,'Choose '+p.name.toLowerCase())}</span>
      </label>)}
    </fieldset>
    <div className="rental-action-bar"><p className="rental-selection" aria-live="polite"><span className="rental-selection-label">{t("已选方案","YOUR SELECTION")}</span>{offerApplies(offer,value)?<>{plan.name} · {t('限时 8 折，首期支付 ','Limited-time 20% off, first period: ')}<b className="rental-offer-price">{money(offerCents(offer,value))}</b>{t('，',' · ')}{plan.renews}</>:<>{plan.name} · {plan.summary}{savings[value]?t('，比连续月付'+savings[value].zh+'省 $'+savings[value].amount,' · Save $'+savings[value].amount+' versus '+savings[value].en):''}</>}</p>
    <a className="rental-pay-button" href={paymentLink(value)}>{t("继续付款","Continue to payment")} · {offerApplies(offer,value)?<>{t('首期 ','first period ')}{money(offerCents(offer,value))}</>:<>{dollars(plan.total)}/{plan.unit}</>}<img src="./assets/chevron.svg" alt="" /></a></div>
    <ul className="rental-terms">
      <li><img src="./assets/check.svg" alt="" />{t("计费周期从交付当天开始","Billing starts on delivery")}</li>
      <li><img src="./assets/check.svg" alt="" />{t("每天价格按一年 365 天折算，实际按所选周期一次付款","Daily prices assume a 365-day year; you pay once per billing period")}</li>
      <li><img src="./assets/check.svg" alt="" />{t("3 个工作日内没交付，全额退款","Not delivered within 3 business days? Full refund")}</li>
      <li><img src="./assets/check.svg" alt="" /><span data-testid="plan-term">{plan.term}</span></li>
      <li><img src="./assets/check.svg" alt="" />{t("每人限 1 台","One Mac per customer")}</li>
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
  const offer = useDailyOffer();
  const off = offerApplies(offer, value);
  return <div className="checkout-page">
    <header className="checkout-nav"><a className="checkout-brand" href={appHref()}><img className="brand-wordmark" src="./assets/wodemac-logo.png" alt="wodeMac" /></a><a href={appHref(undefined,{interval:value})+'#pricing'}>{t("返回选择方案","Back to plans")}</a></header>
    <main className="checkout-main">
      <section className="checkout-details"><p className="checkout-eyebrow">{t("独享 MAC · 美国加州","DEDICATED MAC · CALIFORNIA")}</p><h1>{t("完成付款，","Your own Mac,")}<br />{t("开启你的独享 Mac。","one payment away.")}</h1>
        <p className="checkout-lead">{t("M6 Mac mini，24 小时为你和 Agent 在线。","M6 Mac mini. Always on for you and your agents.")}</p>
        <div className="checkout-product"><img src="./assets/mac-portrait.svg" alt="M6 Mac mini" /><div><strong>{t("独享 Mac mini","Dedicated Mac mini")}</strong><span>{t("Apple M6 · 12 核 CPU · 12 核 GPU","Apple M6 · 12-core CPU · 12-core GPU")}</span><span>{t("16GB 统一内存 · 256GB SSD","16GB unified memory · 256GB SSD")}</span><span>{t("美国加州 · 整台独占","California, USA · Exclusively yours")}</span></div></div>
        <div className="checkout-service"><h2>{t("付款后会发生什么","What happens after payment")}</h2><p>{t("我们为你准备机器并完成配置，3 个工作日内交付。计费从交付当天开始。","We prepare and configure your Mac within 3 business days. Billing starts on delivery.")}</p><p>{t("你可以在账单页查看交付进度与登录信息。","Track delivery and sign-in details on your billing page.")}</p></div>
      </section>
      <section className="checkout-summary" aria-labelledby="order-title"><h2 id="order-title">{t("订单摘要","Order summary")}</h2><div className="checkout-order-line"><span>{t("独享 Mac mini","Dedicated Mac mini")} · {plan.name}</span><strong>{dollars(plan.total)}</strong></div>
        <p className="checkout-cycle">{plan.summary}</p>
        <CheckoutOffer offer={offer} value={value} />
        {(value === 'quarter' || value === 'half' || value === 'year') && <p className="checkout-saving">{value==='year'?t('年付 · 比连续月付一年省 $720','Yearly · Save $720 versus 12 monthly payments'):value==='half'?t('半年付 · 比连续月付半年省 $240','Half-yearly · Save $240 versus 6 monthly payments'):t('季付 · 比连续月付三个月省 $60','Quarterly · Save $60 versus 3 monthly payments')}</p>}
        <dl><div><dt>{t("托管位置","Location")}</dt><dd>{t("美国加州","California, USA")}</dd></div><div><dt>{t("数量","Quantity")}</dt><dd>{t("1 台","1 Mac")}</dd></div><div><dt>{t("计费周期","Billing period")}</dt><dd>{plan.days?t('7 天','7 days'):<>{plan.months}{t(' 个月',plan.months===1?' month':' months')}</>}</dd></div></dl>
        <div className="checkout-total"><span>{t("本次应付","Total due today")} <small>USD</small></span><strong>{off&&<s>{dollars(plan.total)}</s>}{off?<Amount cents={offerCents(offer,value)}/>:<>{dollars(plan.total)}<small>.00</small></>}</strong></div>
        <p className="checkout-policy">{plan.term}{t("。计费周期从交付当天开始。",". Billing starts on delivery.")}</p>
        <p className="checkout-legal">{t("付款即表示你同意","By paying, you agree to the ")}<a href={t("./legal/terms.html","./legal/terms.en.html")}>{t("服务条款","Terms of Service")}</a>{t("和"," and ")}<a href={t("./legal/privacy.html","./legal/privacy.en.html")}>{t("隐私政策","Privacy Policy")}</a>{t("。",".")}</p>
        <CheckoutAction value={value}/>
        <a className="cd-inline-link checkout-operator" href={appHref(undefined,{interval:value})+'#team'}>{t('由 OneLaser 团队运营 · 了解团队','Operated by OneLaser · Meet the team')}</a>
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
  const [accountSlots,setAccountSlots] = useState([]); const [offerSlots,setOfferSlots] = useState([]); const [priceSlots,setPriceSlots] = useState([]); const [menuSlots,setMenuSlots] = useState([]);
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
      setOfferSlots([...root.current.querySelectorAll('[data-offer-slot]')]);
      setPriceSlots([...root.current.querySelectorAll('[data-hero-price-slot]')]);
      setMenuSlots([...root.current.querySelectorAll('[data-menu-slot]')]);
      root.current.querySelectorAll('[data-affiliate-link]').forEach(a => { a.href=appHref('affiliate'); });
      root.current.querySelectorAll('[data-language]').forEach(a => { a.href=appHref(undefined,{lang:a.dataset.language,interval:value}); });
      root.current.querySelector('.caldock-brand').href=appHref();
    }
  }, [value,checkout]);
  useEffect(() => { document.title = checkout ? t('付款 · wodeMac','Checkout · wodeMac') : t('独享 M6 Mac mini · 美国加州 | wodeMac','Dedicated M6 Mac mini · California | wodeMac'); document.documentElement.lang = english ? 'en' : 'zh-CN'; }, [checkout]);
  if (checkout) return <Checkout value={value} />;
  return <>
    <SourceMarkup ref={root} />
    {slots.map(slot => createPortal(<PlanPicker value={value} onChange={setValue} id={slot.dataset.planSlot} />,slot))}
    {accountSlots.map(slot=>createPortal(<AccountEntry/>,slot))}
    {offerSlots.map((slot,index)=>createPortal(<HeroOffer/>,slot,'offer-'+index))}
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
