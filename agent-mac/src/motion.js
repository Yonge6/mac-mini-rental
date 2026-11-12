// Pointer and depth effects layered on the landing markup. Everything here is decoration:
// it is skipped for reduced-motion users, and pointer effects only run with a real mouse.
export function initMotion(node) {
  const offs = [];
  const on = (target, type, fn, options) => { target.addEventListener(type, fn, options); offs.push(() => target.removeEventListener(type, fn, options)); };
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Scene tabs: one pill slides to the selected tab instead of each tab switching colour.
  const tabs = node.querySelector('.wm-scene-tabs');
  if (tabs) {
    const pill = document.createElement('span');
    pill.className = 'wm-tab-pill';
    pill.setAttribute('aria-hidden', 'true');
    tabs.append(pill);
    const place = () => {
      const tab = tabs.querySelector('[aria-selected="true"]');
      if (!tab) return;
      pill.style.width = tab.offsetWidth + 'px';
      pill.style.height = tab.offsetHeight + 'px';
      pill.style.transform = `translate(${tab.offsetLeft}px, ${tab.offsetTop}px)`;
    };
    place();
    tabs.classList.add('has-pill');
    requestAnimationFrame(() => requestAnimationFrame(() => pill.classList.add('is-ready')));
    const watcher = new MutationObserver(place);
    watcher.observe(tabs, { subtree: true, attributes: true, attributeFilter: ['aria-selected'] });
    on(window, 'resize', place);
    document.fonts?.ready.then(place);
    offs.push(() => { watcher.disconnect(); pill.remove(); tabs.classList.remove('has-pill'); });
  }

  if (!fine || reduce) return () => offs.forEach(off => off());

  // Cards: a soft light and a lit edge follow the pointer.
  const SPOT = '.hm-panel, .wm-uses li, .wm-compare-stats > li, .hm-proof-ip';
  let spotHost = null;
  let sceneVisual = null;
  const hero = node.querySelector('.afterglow-hero');
  const heroCta = hero?.querySelector('.hm-cta');
  const clearScene = () => { sceneVisual?.style.removeProperty('--tx'); sceneVisual?.style.removeProperty('--ty'); sceneVisual = null; };
  on(node, 'pointermove', event => {
    if (event.pointerType !== 'mouse') return;
    const host = event.target.closest?.(SPOT) ?? null;
    if (host !== spotHost) {
      spotHost?.classList.remove('is-spot');
      spotHost = host;
      if (host) {
        if (!host.querySelector(':scope > .wm-spot')) {
          if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
          const light = document.createElement('span');
          light.className = 'wm-spot';
          light.setAttribute('aria-hidden', 'true');
          host.append(light);
        }
        host.classList.add('is-spot');
      }
    }
    if (host) {
      const box = host.getBoundingClientRect();
      host.style.setProperty('--mx', (event.clientX - box.left).toFixed(1) + 'px');
      host.style.setProperty('--my', (event.clientY - box.top).toFixed(1) + 'px');
    }
    // Scene picture: the photo and the timeline card move at different depths.
    const visual = event.target.closest?.('.wm-scene-visual') ?? null;
    if (visual !== sceneVisual) { clearScene(); sceneVisual = visual; }
    if (visual) {
      const box = visual.getBoundingClientRect();
      visual.style.setProperty('--tx', (((event.clientX - box.left) / box.width) * 2 - 1).toFixed(3));
      visual.style.setProperty('--ty', (((event.clientY - box.top) / box.height) * 2 - 1).toFixed(3));
    }
  }, { passive: true });
  on(node, 'pointerleave', () => { spotHost?.classList.remove('is-spot'); spotHost = null; clearScene(); });

  // Hero: the Mac drifts against the pointer; the reserve button leans towards it when close.
  if (hero) {
    on(hero, 'pointermove', event => {
      if (event.pointerType !== 'mouse') return;
      const box = hero.getBoundingClientRect();
      hero.style.setProperty('--px', (((event.clientX - box.left) / box.width) * 2 - 1).toFixed(3));
      hero.style.setProperty('--py', (((event.clientY - box.top) / box.height) * 2 - 1).toFixed(3));
      if (heroCta) {
        const cta = heroCta.getBoundingClientRect();
        const dx = event.clientX - (cta.left + cta.width / 2), dy = event.clientY - (cta.top + cta.height / 2);
        const near = Math.abs(dx) < cta.width / 2 + 70 && Math.abs(dy) < cta.height / 2 + 60;
        heroCta.style.setProperty('--gx', near ? (dx * 0.14).toFixed(1) + 'px' : '0px');
        heroCta.style.setProperty('--gy', near ? (dy * 0.22).toFixed(1) + 'px' : '0px');
      }
    }, { passive: true });
    on(hero, 'pointerleave', () => {
      hero.style.setProperty('--px', '0'); hero.style.setProperty('--py', '0');
      heroCta?.style.setProperty('--gx', '0px'); heroCta?.style.setProperty('--gy', '0px');
    });
  }
  return () => { offs.forEach(off => off()); node.querySelectorAll('.wm-spot').forEach(light => light.remove()); };
}
