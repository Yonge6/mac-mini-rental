# Frontend rules

These instructions apply to `agent-mac/`; also follow the repository-root `AGENTS.md`. They replace older historical pricing and branding notes. See `../docs/DEVELOPMENT.md` for commands and releases.

## Source and runtime
- Edit app UI in `src/`. Chinese/English raw landing markup is in `source.html` / `source.en.html`; interactive plan/checkout composition is in `App.jsx` and account logic in `src/commerce/`.
- Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs` and Sites runtime tests intact. Build produces `dist/client`, `dist/server/index.js`, `dist/.openai/hosting.json`.
- Start the local preview yourself for UI work. Check rendered desktop/phone views, primary interactions and console errors; a build alone is not visual acceptance.

## Current brand and design
- Brand is WodeMac (renamed from CalDock on 2026-11-03). The site is at `https://wodemac.com/`; `craftos.app/caldock/` redirects there. Keep technical `caldock` identifiers (`/api/caldock`, CSS classes, error codes, storage keys) unchanged.
- Preserve California Afterglow: espresso surfaces, ivory type, amber actions, warm sunset photos and the premium champagne/gold pricing cards. Keep existing WodeMac logo, layout, genuine assets and responsive behavior unless the task targets them.
- Keep original motion: moving network dashes (horizontal desktop / vertical phone), staggered entrances, remote-window glow, stock count/sweep/glints and scroll hint. Respect reduced-motion preferences; never disable motion globally for screenshots.
- Keep all headings, FAQ question titles and hero stock number bold. Header remains logo, in-page anchors, login and `中 / En`; no old platform directory/footer, download row or boss-presentation section.

## Product copy and pricing
- Location is United States / California only; no Europe or random allocation. Page product copy currently says M6 Mac mini. Hardware changes require confirmed product information, not invented specifications.
- Four plans are on sale. Monthly: USD 169 standard. Quarterly: USD 481.65 for 3 months (5% off). Half-yearly: USD 912.60 for 6 months (10% off). Yearly: USD 1723.80 for 12 months (15% off), featured. Prices are per Mac and an order can hold several. Yearly orders of 5 or more get a further 2.5% off the first year; renewals are at the yearly price.
- The largest price on the hero and plan cards is a daily rate on a 365-day year, rounded up (`dailyCents`). Always show the actual charge beside it. The plan selector stays in the lower pricing section; reserve buttons scroll there. Preserve the interval through checkout, language switch, auth callback and customer/admin displays.
- Versus monthly payments, quarter saves USD 25.35, half-year USD 101.40, year USD 304.20. Previous USD 1799 annual and two-plan layouts are obsolete.
- Stock totals are set on the admin stock page and come from the backend; the numbers in the landing markup are only the first paint.
- The only discounts are the fixed plan discounts above; there is no time-limited offer or seat countdown.
- Brand line: "我的 Mac，在美国加州。" / "Your own Mac, in California, USA." Main audience is mainland China teams shipping products overseas. Delivery copy: usually within 24 hours, 3 business days at the latest. Never present a California Mac as a way to reach region-restricted AI services.
- Prices live in `src/commerce/plans.mjs`; backend independently validates prices. Changes affect new orders, never existing order/commission snapshots. No credits, wallet or top-up wording.

## Accounts, payments and referrals
- Reuse the existing craftos.app Fastify/PostgreSQL backend (`Yonge6/onelaser-workos-api`), not Supabase. Keep its CalDock namespace, identity, cookies, admin checks and audits independent from Work OS.
- Real sign-in depends on configured providers. Demo mode is explicitly fictional and browser-local; never let it stand in for a real provider login, account, payment or shared write.
- The landing page recruits referral partners and resellers. The page states the owner's commission: on a customer's first order, 15% yearly, 10% half-yearly, 7.5% quarterly, 5% monthly; one tier only, nothing on renewals. If the admin rates change, update the page and terms too.
- Paid order states/commissions require verified backend payment events. Affiliate links retain first-touch attribution and administrator-configured rules. No automatic payouts.
- GitHub marketing routes real accounts/checkout to same-origin `https://wodemac.com/`; keep repository-subpath assets and query-based route refresh working.

## Operator trust content
- Do not mention OneLaser on the site. Contact email: hustyy986@gmail.com. Legal pages name the contracting entity, WodeMac Inc, with only "California, USA" as its location. Nowhere on the site show another company name, a personal name, a full street address, a phone number, or contact details other than the owner's WeChat QR and hustyy986@gmail.com.
- Editing `decision-studio/` also requires that directory's own instructions. It is not public and must stay outside `public/`. Preserve local calculations and permissioned shared writes; don't overwrite saved drafts with new defaults.
