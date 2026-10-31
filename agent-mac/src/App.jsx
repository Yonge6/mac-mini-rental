import { forwardRef, memo, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import source from './source.html?raw';

const SourceMarkup = memo(forwardRef(function SourceMarkup(_, ref) { return <div ref={ref} dangerouslySetInnerHTML={{__html:source}} />; }));

const plans = {
  month: { name: '月付', monthly: 160, total: 160, unit: '月', summary: '每月支付 $160', term: '随时取消续订，当期结束后停止' },
  year: { name: '年付', monthly: 120, total: 1440, unit: '年', summary: '一次支付 $1,440，享用 12 个月', term: '年付一次付清，一年内不能取消或退款' },
};
const dollars = n => '$' + n.toLocaleString('en-US');
const paymentLink = interval => (interval === 'year' ? import.meta.env.VITE_CHECKOUT_YEAR_URL : import.meta.env.VITE_CHECKOUT_MONTH_URL) || './?view=checkout&interval='+interval;

function PlanPicker({ value, onChange, id }) {
  const plan = plans[value];
  return <section className="rental-plan" aria-label="选择付款方案">
    <p className="rental-plan-caption">第二批早鸟价</p>
    <div className="rental-amount" aria-live="polite"><strong>{dollars(plan.monthly)}</strong><span>/月</span><s>$220</s></div>
    <p className="rental-price-note">{value === 'year' ? '年付一次 $1,440，比月付一年省 $480。' : '第二批 100 台售完后，新订单为 $220/月；已下单用户保持早鸟价。'}</p>
    <fieldset className="rental-options"><legend className="sr-only">付款周期</legend>
      {Object.entries(plans).map(([key,p]) => <label className={'rental-option ' + (value === key ? 'is-selected ' : '') + (key === 'year' ? 'is-annual' : '')} key={key}>
        <input type="radio" name={'billing-'+id} value={key} checked={value === key} onChange={() => onChange(key)} />
        <span className="rental-radio" aria-hidden="true">{value === key && <img src="./assets/check.svg" alt="" />}</span>
        <span className="rental-option-name"><strong>{p.name}</strong>{key === 'year' && <small>一次付 $1,440</small>}</span>
        <span className="rental-option-price"><b>{dollars(p.monthly)}/月</b>{key === 'year' && <em>7.5 折</em>}</span>
      </label>)}
    </fieldset>
    <a className="rental-pay-button" href={paymentLink(value)}>继续付款 · {dollars(plan.total)}/{plan.unit}</a>
    <ul className="rental-terms">
      <li><img src="./assets/check.svg" alt="" />计费周期从交付当天开始</li>
      <li><img src="./assets/check.svg" alt="" />3 个工作日内没交付，全额退回积分</li>
      <li><img src="./assets/check.svg" alt="" /><span data-testid="plan-term">{plan.term}</span></li>
      <li><img src="./assets/check.svg" alt="" />每人限 1 台</li>
    </ul>
  </section>;
}

function useSourceInteractions(root, onCookie) {
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const nav = node.querySelector('.site-nav');
    const menu = node.querySelector('.site-nav-menu');
    const menuButton = node.querySelector('.site-nav-menu-button');
    const initialMenu = menu.innerHTML;
    const familyNames = ['services', 'workspace', 'market', 'modelApi', null, null, 'support'];
    const closeFlyout = () => {
      nav.removeAttribute('data-flyout');
      node.querySelector('.site-nav-scrim')?.removeAttribute('data-open');
      nav.querySelectorAll('[data-family]').forEach(li => li.removeAttribute('data-open'));
      nav.style.setProperty('--site-flyout-height', '0px');
      node.querySelectorAll('.site-nav-flyout-panel').forEach(p => p.removeAttribute('data-active'));
      node.querySelectorAll('.site-nav-family-more').forEach(b => b.setAttribute('aria-expanded', 'false'));
    };
    const showFlyout = (key) => {
      closeFlyout();
      const panel = nav.querySelector('[id$="-'+key+'"].site-nav-flyout-panel');
      if (!panel) return;
      nav.setAttribute('data-flyout', '');
      panel.setAttribute('data-active','');
      nav.querySelector('[data-family="'+key+'"]')?.setAttribute('data-open','');
      nav.querySelector('[aria-controls="'+panel.id+'"]')?.setAttribute('aria-expanded','true');
      nav.style.setProperty('--site-flyout-height',panel.scrollHeight+'px');
      node.querySelector('.site-nav-scrim')?.setAttribute('data-open','');
    };
    const hover = e => { const family = e.target.closest('.site-nav-families>li'); if (family) showFlyout(family.dataset.family); };
    const toggleMenu = (open) => {
      menu.hidden = !open;
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
      document.body.style.overflow = open ? 'hidden' : '';
      if (!open) menu.innerHTML = initialMenu;
      closeFlyout();
    };
    const click = e => {
      const button = e.target.closest('button');
      if (button?.matches('[data-slot="collapsible-trigger"]')) {
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
      } else if (button === menuButton) {
        toggleMenu(menu.hidden);
      } else if (button?.matches('.site-nav-menu-back')) {
        menu.innerHTML = initialMenu;
      } else if (button?.closest('.site-nav-menu-families')) {
        const li = button.closest('li');
        const key = familyNames[[...li.parentElement.children].indexOf(li)];
        const panel = node.querySelector('[id$="-'+key+'"].site-nav-flyout-panel');
        if (panel) menu.innerHTML = '<div class="site-nav-menu-view"><button class="site-nav-menu-back" type="button"><img src="./assets/chevron.svg" alt="" />返回</button>'+panel.innerHTML+'</div>';
      } else if (button?.matches('.site-nav-family-more')) {
        const panel = document.getElementById(button.getAttribute('aria-controls'));
        const shouldOpen = !panel.hasAttribute('data-active');
        closeFlyout();
        if (shouldOpen) {
          showFlyout(button.closest('[data-family]').dataset.family);
        }
      } else if (button?.textContent.trim() === 'Cookie 设置') onCookie(true);
      const anchor = e.target.closest('a[href^="#"]');
      if (anchor) {
        if (!menu.hidden) toggleMenu(false);
        closeFlyout();
        node.querySelector('.site-language-picker')?.removeAttribute('open');
      }
    };
    const escape = e => {
      if (e.key === 'Escape') {
        toggleMenu(false);
        node.querySelector('.site-language-picker')?.removeAttribute('open');
        onCookie(false);
      }
    };
    const dismiss = e => {
      if (!e.target.closest('header.site-nav')) {
        closeFlyout();
        node.querySelector('.site-language-picker')?.removeAttribute('open');
      }
    };
    node.addEventListener('click', click);
    nav.addEventListener('pointerover', hover);
    nav.addEventListener('mouseleave', closeFlyout);
    document.addEventListener('keydown', escape);
    document.addEventListener('click', dismiss);
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in-view');observer.unobserve(entry.target); } });
    }, { threshold: 0.06 });
    node.querySelectorAll('.site-reveal-group').forEach(element => {
      element.classList.add('site-reveal-animated');observer.observe(element);
    });
    return () => {
      node.removeEventListener('click',click);nav.removeEventListener('pointerover',hover);nav.removeEventListener('mouseleave',closeFlyout);document.removeEventListener('keydown',escape);document.removeEventListener('click',dismiss);
      document.body.style.overflow='';observer.disconnect();
    };
  }, [root, onCookie]);
}

function Checkout({ value }) {
  const plan = plans[value];
  const [notice,setNotice] = useState(false);
  const paymentUrl = value === 'year' ? import.meta.env.VITE_CHECKOUT_YEAR_URL : import.meta.env.VITE_CHECKOUT_MONTH_URL;
  return <div className="checkout-page">
    <header className="checkout-nav"><a className="checkout-brand" href="./"><img src="./assets/icon-192.png" alt="" />Agent.Space</a><a href={'./?interval='+value+'#choose-plan'}>返回选择方案</a></header>
    <main className="checkout-main">
      <section className="checkout-details"><p className="checkout-eyebrow">独享 MAC · 美国加州</p><h1>完成付款，<br />开启你的独享 Mac。</h1>
        <p className="checkout-lead">M6 Mac mini，24 小时为你和 Agent 在线。</p>
        <div className="checkout-product"><img src="./assets/mac-portrait.svg" alt="M6 Mac mini" /><div><strong>独享 Mac mini</strong><span>Apple M6 · 12 核 CPU · 12 核 GPU</span><span>16GB 统一内存 · 256GB SSD</span><span>美国加州 · 整台独占</span></div></div>
        <div className="checkout-service"><h2>付款后会发生什么</h2><p>我们为你准备机器并完成配置，3 个工作日内交付。计费从交付当天开始。</p><p>你可以在账单页查看交付进度与登录信息。</p></div>
      </section>
      <section className="checkout-summary" aria-labelledby="order-title"><h2 id="order-title">订单摘要</h2><div className="checkout-order-line"><span>独享 Mac mini · {plan.name}</span><strong>{dollars(plan.total)}</strong></div>
        <p className="checkout-cycle">{plan.summary}</p>
        {value === 'year' && <p className="checkout-saving">年付 7.5 折 · 每年省 $480</p>}
        <dl><div><dt>托管位置</dt><dd>美国加州</dd></div><div><dt>数量</dt><dd>1 台</dd></div><div><dt>计费周期</dt><dd>{value === 'year' ? '12 个月' : '1 个月'}</dd></div></dl>
        <div className="checkout-total"><span>本次应付 <small>USD</small></span><strong>{dollars(plan.total)}<small>.00</small></strong></div>
        <p className="checkout-policy">{plan.term}。计费周期从交付当天开始。</p>
        <button className="rental-pay-button" type="button" onClick={() => { if (paymentUrl) location.assign(paymentUrl); else setNotice(true); }}>支付 {dollars(plan.total)}</button>
        {notice && <p className="checkout-notice" role="status">付款通道暂未开放，请稍后再试。本次没有扣款。</p>}
        <p className="checkout-secure">付款信息将通过安全付款页面处理</p>
        <a className="checkout-change" href={'./?interval='+value+'#choose-plan'}>更改付款方案</a>
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
  const [cookie,setCookie] = useState(false);
  const checkout = location.pathname === '/checkout' || new URLSearchParams(location.search).get('view') === 'checkout';
  useSourceInteractions(root,setCookie);
  useEffect(() => {
    sessionStorage.setItem('rental-interval',value);
    if (!checkout) { const url = new URL(location.href); url.searchParams.set('interval', value); history.replaceState(null, '', url); }
    if (!checkout) setSlots([...root.current.querySelectorAll('[data-plan-slot]')]);
  }, [value,checkout]);
  useEffect(() => { document.title = checkout ? '付款 · 美国加州 M6 Mac mini' : '独享 M6 Mac mini · 美国加州 | Agent.Space'; }, [checkout]);
  if (checkout) return <Checkout value={value} />;
  return <>
    <SourceMarkup ref={root} />
    {slots.map(slot => createPortal(<PlanPicker value={value} onChange={setValue} id={slot.dataset.planSlot} />,slot))}
    {cookie && <aside className="cookie-panel" aria-label="Cookie 设置"><strong>Cookie 设置</strong><p>此页面仅使用必要的本地存储来保留你选择的付款周期。</p><div><button type="button" onClick={() => setCookie(false)}>拒绝</button><button type="button" onClick={() => setCookie(false)}>同意</button></div><button className="cookie-close" aria-label="关闭 Cookie 设置" onClick={() => setCookie(false)}>关闭</button></aside>}
  </>;
}
