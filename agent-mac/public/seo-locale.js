// Run before the app module, without inline code or a new routing backend.
(() => {
  const url = new URL(window.location.href);
  const accountView = url.searchParams.has('view') || /\/checkout\/?$/.test(url.pathname);
  if (accountView) {
    document.documentElement.setAttribute('data-app-route', '');
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex,follow';
    document.head.append(robots);
    return;
  }
  if (/\/en\.html$/.test(url.pathname)) {
    if (url.searchParams.get('lang') !== 'en') {
      url.searchParams.set('lang', 'en');
      window.history.replaceState(null, '', url);
    }
    return;
  }
  if (url.searchParams.get('lang') === 'en') {
    const englishUrl = new URL('./en.html', url);
    englishUrl.search = url.search;
    englishUrl.hash = url.hash;
    window.location.replace(englishUrl);
  }
})();
