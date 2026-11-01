# Frontend rules

These instructions apply to `agent-mac/`; also follow the repository-root `AGENTS.md`. They replace older historical pricing and branding notes. See `../docs/DEVELOPMENT.md` for commands and releases.

## Source and runtime
- Edit app UI in `src/`. Chinese/English raw landing markup is in `source.html` / `source.en.html`; interactive plan/checkout composition is in `App.jsx` and account logic in `src/commerce/`.
- Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs` and Sites runtime tests intact. Build produces `dist/client`, `dist/server/index.js`, `dist/.openai/hosting.json`.
- Start the local preview yourself for UI work. Check rendered desktop/phone views, primary interactions and console errors; a build alone is not visual acceptance.

## Current brand and design
- Brand is CalDock. The user paused the GRIDRUN rename; PACE and other proposals are not approved. Do not import unpublished rename work without a new decision.
- Preserve California Afterglow: espresso surfaces, ivory type, amber actions, warm sunset photos and the premium champagne/gold pricing cards. Keep existing CalDock logo, layout, genuine assets and responsive behavior unless the task targets them.
- Keep original motion: moving network dashes (horizontal desktop / vertical phone), staggered entrances, remote-window glow, stock count/sweep/glints and scroll hint. Respect reduced-motion preferences; never disable motion globally for screenshots.
- Keep all headings, FAQ question titles and hero stock number bold. Header remains logo, in-page anchors, login and `中 / En`; no old platform directory/footer, download row or boss-presentation section.

## Product copy and pricing
- Location is United States / California only; no Europe or random allocation. Page product copy currently says M6 Mac mini. Hardware changes require confirmed product information, not invented specifications.
- Monthly: USD 199 for 1 month. Quarterly: USD 507 for 3 months (169/month). Yearly: USD 1548 for 12 months (129/month), featured.
- Hero shows $129/month starting price with $1548 billed annually. The plan selector stays in the lower pricing section; reserve buttons scroll there. Preserve the interval through checkout, language switch, auth callback and customer/admin displays.
- Quarter saves USD 90 vs three monthly payments; year saves USD 840 vs twelve monthly payments. Previous USD 1799 annual and two-plan layouts are obsolete.
- Prices live in `src/commerce/plans.mjs`; backend independently validates prices. Changes affect new orders, never existing order/commission snapshots. No credits, wallet or top-up wording.

## Accounts, payments and referrals
- Reuse the existing craftos.app Fastify/PostgreSQL backend (`Yonge6/onelaser-workos-api`), not Supabase. Keep its CalDock namespace, identity, cookies, admin checks and audits independent from Work OS.
- Real sign-in depends on configured providers. Demo mode is explicitly fictional and browser-local; never let it stand in for a real provider login, account, payment or shared write.
- Paid order states/commissions require verified backend payment events. Affiliate links retain first-touch attribution and administrator-configured rules. No automatic payouts.
- GitHub marketing routes real accounts/checkout to same-origin `https://craftos.app/caldock/`; keep repository-subpath assets and query-based route refresh working.

## Operator trust content
- CalDock is operated by the OneLaser team. Preserve the real California office photo, official team photo and public company links; do not fabricate people or endorsements.
- User-selected official video `tSroh4OUkX4` follows the office/team grid, above company details, in both languages. Responsive 16:9, lazy YouTube embed, no autoplay, YouTube fallback link.
- The video shows OneLaser's production facility, not a CalDock server room or proof of Mac hosting infrastructure.
- Editing `public/decision-studio/` also requires that directory's own instructions. Preserve public viewing, local calculations and permissioned shared writes; don't overwrite saved drafts with new defaults.
