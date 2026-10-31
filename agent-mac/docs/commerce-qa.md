# Accounts, orders, referrals and operator section — 2026-10-31

## Browser acceptance

Codex in-app browser, local Vite app proxied to the actual CalDock API, desktop 1440 × 1000 and phone 390 × 844.

- Provider availability comes from the server. Unconfigured Google and Apple buttons remain disabled; the page explains that sign-in is being prepared.
- Explicit customer/admin demos use fictional browser-local data and a persistent demo notice. They do not call business APIs.
- Administrator preview: filtered orders, opened a detail, delivered a provisioning order, changed commission settings, approved a commission and recorded an offline settlement reference. No money was transferred.
- Customer preview: copied a referral link, opened yearly checkout ($1,799), created a fictional pending order, followed its detail link, cancelled it and edited the display name. No paid success is simulated.
- Phone English referral table scrolls within its container. Account settings and sign-out remain accessible from the header menu.
- `/caldock/?view=login` loads relative assets and the login page correctly, matching the production mount path.
- Real operator section uses the supplied office photograph and official 280 × 220 team image at native size or smaller. Both load, desktop and phone have no document overflow, and the fixed header does not cover the section title.
- Pricing and checkout link to the operator context; Chinese and English content use the same confirmed operator relationship.

Screenshots are preserved in the SSD QA archive: `commerce-login-desktop.png`, `commerce-admin-overview.png`, `commerce-admin-settings.png`, `commerce-affiliate-desktop.png`, `commerce-affiliate-mobile-en.png`, `commerce-login-mobile-en.png`, `trust-site-full.png`, `trust-team-desktop.png`, `trust-team-mobile.png`.

## Automated acceptance

- Frontend production build, four hosting contracts and four commerce URL/referral/currency contracts passed.
- Backend typecheck/build passed; the complete embedded PostgreSQL suite had 198 passing tests and one Caddy skip. Running with the installed real Caddy separately passed all eight redirect/edge checks.
- Twelve CalDock backend tests cover provider availability, JWT claims, OAuth state/replay, independent sessions, CSRF/Origin/roles, order ownership/prices/idempotency, referral attribution, payment event deduplication, commission snapshots/refunds, delivery versions and manual settlement audit.
- Production container and real PostgreSQL checks run in GitHub CI before deployment.

Real Google/Apple consent, merchant collection and commission payout are not yet enabled. They require the agreed provider setup and a verified payment adapter; preview completion is not proof of real authentication or collection.
