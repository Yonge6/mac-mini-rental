import { forwardRef, memo, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import sourceZh from './source.html?raw';
import sourceEn from './source.en.html?raw';
const english = new URLSearchParams(location.search).get('lang') === 'en';
const language = english ? 'en' : 'zh';
const t = (zh, en) => english ? en : zh;
const source = english ? sourceEn : sourceZh;

const SourceMarkup = memo(forwardRef(function SourceMarkup(_, ref) { return <div ref={ref} dangerouslySetInnerHTML={{__html:source}} />; }));

const plans = {
  month: { name: t('月付','Monthly'), monthly: 199, total: 199, unit: t('月','month'), summary: t('每月支付 $199','$199 billed monthly'), term: t('随时取消续订，当期结束后停止','Cancel renewal anytime; service ends after the current period') },
  year: { name: t('年付','Yearly'), monthly: 149.92, total: 1799, unit: t('年','year'), summary: t('一次支付 $1,799，享用 12 个月','$1,799 paid upfront for 12 months'), term: t('年付一次付清，一年内不能取消或退款','Yearly is paid upfront and is non-refundable during the year') },
};
const dollars = n => '$' + n.toLocaleString('en-US');
const paymentLink = interval => (interval === 'year' ? import.meta.env.VITE_CHECKOUT_YEAR_URL : import.meta.env.VITE_CHECKOUT_MONTH_URL) || './?view=checkout&lang='+language+'&interval='+interval;

function PlanPicker({ value, onChange, id }) {
  const plan = plans[value];
  return <section className="rental-plan" aria-label={t("选择付款方案","Choose your billing plan")}>
    <p className="rental-plan-caption">{t("第二批早鸟价","Batch 2 early-bird price")}</p>
    {value === "year" && <p className="rental-equivalent">{t("年付折合约","Equivalent to approximately")}</p>}
    <div className="rental-amount" aria-live="polite"><strong>{dollars(plan.monthly)}</strong><span>{t("/月","/month")}</span><s>$249</s></div>
    <p className="rental-price-note">{value === 'year' ? t('年付一次 $1,799，比月付一年省 $589。','$1,799 paid yearly. Save $589 compared with monthly billing.') : t('第二批 100 台售完后，新订单为 $249/月；已下单用户保持早鸟价。','After batch 2 sells out, new orders are $249/month. Existing orders keep their early-bird price.')}</p>
    <fieldset className="rental-options"><legend className="sr-only">{t("付款周期","Billing period")}</legend>
      {Object.entries(plans).map(([key,p]) => <label className={'rental-option ' + (value === key ? 'is-selected ' : '') + (key === 'year' ? 'is-annual' : '')} key={key}>
        <input type="radio" name={'billing-'+id} value={key} checked={value === key} onChange={() => onChange(key)} />
        <span className="rental-radio" aria-hidden="true">{value === key && <img src="./assets/check.svg" alt="" />}</span>
        <span className="rental-option-name"><strong>{p.name}</strong>{key === 'year' && <small>{t("一次付 $1,799","$1,799 paid upfront")}</small>}</span>
        <span className="rental-option-price"><b>{key === "year" && t("约 ","≈ ")}{dollars(p.monthly)}{t("/月","/month")}</b>{key === 'year' && <em>{t("约7.5折","About 25% off")}</em>}</span>
      </label>)}
    </fieldset>
    <a className="rental-pay-button" href={paymentLink(value)}>{t("继续付款","Continue to payment")} · {dollars(plan.total)}/{plan.unit}</a>
    <ul className="rental-terms">
      <li><img src="./assets/check.svg" alt="" />{t("计费周期从交付当天开始","Billing starts on delivery")}</li>
      <li><img src="./assets/check.svg" alt="" />{t("3 个工作日内没交付，全额退回积分","Not delivered within 3 business days? Full credit refund")}</li>
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
      observer.disconnect();activeSections.disconnect();
    };
  }, [root]);
}

function Checkout({ value }) {
  const plan = plans[value];
  const [notice,setNotice] = useState(false);
  const paymentUrl = value === 'year' ? import.meta.env.VITE_CHECKOUT_YEAR_URL : import.meta.env.VITE_CHECKOUT_MONTH_URL;
  return <div className="checkout-page">
    <header className="checkout-nav"><a className="checkout-brand" href={"./?lang="+language}><img src="./assets/caldock-logo.png" alt="" />CalDock</a><a href={'./?lang='+language+'&interval='+value+'#pricing'}>{t("返回选择方案","Back to plans")}</a></header>
    <main className="checkout-main">
      <section className="checkout-details"><p className="checkout-eyebrow">{t("独享 MAC · 美国加州","DEDICATED MAC · CALIFORNIA")}</p><h1>{t("完成付款，","Your own Mac,")}<br />{t("开启你的独享 Mac。","one payment away.")}</h1>
        <p className="checkout-lead">{t("M6 Mac mini，24 小时为你和 Agent 在线。","M6 Mac mini. Always on for you and your agents.")}</p>
        <div className="checkout-product"><img src="./assets/mac-portrait.svg" alt="M6 Mac mini" /><div><strong>{t("独享 Mac mini","Dedicated Mac mini")}</strong><span>{t("Apple M6 · 12 核 CPU · 12 核 GPU","Apple M6 · 12-core CPU · 12-core GPU")}</span><span>{t("16GB 统一内存 · 256GB SSD","16GB unified memory · 256GB SSD")}</span><span>{t("美国加州 · 整台独占","California, USA · Exclusively yours")}</span></div></div>
        <div className="checkout-service"><h2>{t("付款后会发生什么","What happens after payment")}</h2><p>{t("我们为你准备机器并完成配置，3 个工作日内交付。计费从交付当天开始。","We prepare and configure your Mac within 3 business days. Billing starts on delivery.")}</p><p>{t("你可以在账单页查看交付进度与登录信息。","Track delivery and sign-in details on your billing page.")}</p></div>
      </section>
      <section className="checkout-summary" aria-labelledby="order-title"><h2 id="order-title">{t("订单摘要","Order summary")}</h2><div className="checkout-order-line"><span>{t("独享 Mac mini","Dedicated Mac mini")} · {plan.name}</span><strong>{dollars(plan.total)}</strong></div>
        <p className="checkout-cycle">{plan.summary}</p>
        {value === 'year' && <p className="checkout-saving">{t("年付 约7.5折 · 每年省 $589","About 25% off yearly · Save $589 a year")}</p>}
        <dl><div><dt>{t("托管位置","Location")}</dt><dd>{t("美国加州","California, USA")}</dd></div><div><dt>{t("数量","Quantity")}</dt><dd>{t("1 台","1 Mac")}</dd></div><div><dt>{t("计费周期","Billing period")}</dt><dd>{value === 'year' ? t('12 个月','12 months') : t('1 个月','1 month')}</dd></div></dl>
        <div className="checkout-total"><span>{t("本次应付","Total due today")} <small>USD</small></span><strong>{dollars(plan.total)}<small>.00</small></strong></div>
        <p className="checkout-policy">{plan.term}{t("。计费周期从交付当天开始。",". Billing starts on delivery.")}</p>
        <button className="rental-pay-button" type="button" onClick={() => { if (paymentUrl) location.assign(paymentUrl); else setNotice(true); }}>{t("支付","Pay")} {dollars(plan.total)}</button>
        {notice && <p className="checkout-notice" role="status">{t("付款通道暂未开放，请稍后再试。本次没有扣款。","Payments are not open yet. Please try again later. You have not been charged.")}</p>}
        <p className="checkout-secure">{t("付款信息将通过安全付款页面处理","Payment details are processed on a secure checkout page")}</p>
        <a className="checkout-change" href={'./?lang='+language+'&interval='+value+'#pricing'}>{t("更改付款方案","Change billing plan")}</a>
      </section>
    </main>
  </div>;
}

export function App() {
  const root = useRef(null);
  const [value,setValue] = useState(() => {
    const query = new URLSearchParams(location.search).get('interval');
    const saved = sessionStorage.getItem('rental-interval');
    return query === 'year' || (query !== 'month' && saved === 'year') ? 'year' : 'month';
  });
  const [slots,setSlots] = useState([]);
  const checkout = location.pathname === '/checkout' || new URLSearchParams(location.search).get('view') === 'checkout';
  useSourceInteractions(root);
  useEffect(() => {
    sessionStorage.setItem('rental-interval',value);
    if (!checkout) { const url = new URL(location.href); url.searchParams.set('interval', value); history.replaceState(null, '', url); }
    if (!checkout) {
      setSlots([...root.current.querySelectorAll('[data-plan-slot]')]);
      root.current.querySelectorAll('[data-language]').forEach(a => { a.href='./?lang='+a.dataset.language+'&interval='+value; });
    }
  }, [value,checkout]);
  useEffect(() => { document.title = checkout ? t('付款 · CalDock','Checkout · CalDock') : t('独享 M6 Mac mini · 美国加州 | CalDock','Dedicated M6 Mac mini · California | CalDock'); document.documentElement.lang = english ? 'en' : 'zh-CN'; }, [checkout]);
  if (checkout) return <Checkout value={value} />;
  return <>
    <SourceMarkup ref={root} />
    {slots.map(slot => createPortal(<PlanPicker value={value} onChange={setValue} id={slot.dataset.planSlot} />,slot))}
  </>;
}
