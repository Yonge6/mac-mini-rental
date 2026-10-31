# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## User decisions (2026-10-31)
- Preserve the Agent.Space reference page's design, content structure and original assets.
- Hosting region is 美国加州 only. Remove Europe and random location allocation everywhere, including hidden FAQ and accessible labels.
- Product is M6 Mac mini. Apple official specifications verified: 12-core CPU, 12-core GPU; keep 16GB unified memory and 256GB SSD.
- Show both monthly ($199/month) and annual ($1,799 upfront, $149.92/month) on the same page, following the user-provided pricing screenshot. Select inline, then go directly to the payment page. Do not route through the reference site's billing page.
- Real collection is not configured yet. Never claim payment succeeded when no payment provider was used.
- The user requested a GitHub-hosted URL. Publish this preview through GitHub Pages. Keep relative asset URLs and query-based checkout routing so repository subpaths and direct refresh work.

## Hero correction (2026-10-31)
- Restore the first screen to the original Agent.Space hero: large 独享 Mac title on the left, original Mac illustration and stock board on the right. Keep 美国加州 and M6 copy.
- Keep monthly/annual payment selection only in the lower pricing section. Hero/navigation reserve buttons scroll to #pricing; returning from payment also goes to #pricing. Do not put a payment selector in the hero.
- Brand is now CalDock (California + Dock). Replace every old Agent.Space logo/name in the page, hero badge, software list, checkout, title and favicon with the generated CalDock mark.
- Header: only CalDock brand, language switch and in-page anchors; no promotion strip, platform product navigation or start button. Language switching stays local (Chinese/English).
- Remove the remote-screen app download row and the entire old footer directory/legal/cookie/compliance blocks, as requested in the annotations.

- Previous pricing (superseded by the 2026-11-01 three-plan decision below): USD $199/month, crossed-out $249/month; annual $1,799 upfront.

- Header language control displays exactly 中 / En as direct local-language links, with the active language emphasized.

- Remove the entire boss-presentation promotion section (.hm-boss), including its illustration, presentation and PPT links. Pricing now flows directly into delivery.

- Do not use a credits, wallet balance or top-up concept anywhere. Describe direct payment, renewal payments and refunds in both Chinese and English.
- All heading levels and FAQ question titles are bold. The hero stock count is also bold, without changing its size or position.
- Use dark backgrounds throughout the page, header and checkout; no white page or navigation surface. Keep text readable with pale foregrounds and the blue active-section accent.

## Selected redesign (2026-10-31)
- User selected the second displayed Product Design mock: California Afterglow. Exact visual target: `../qa/style-proposals-2026-10-31/02-california-afterglow.png`.
- This choice replaces the earlier blue/graphite visual direction: use deep espresso surfaces, ivory type, amber actions and warm sunset photography throughout the landing page and checkout. Preserve the existing CalDock logo.
- Keep oversized bold left hero copy and right Mac/inventory composition. The hero reserve action scrolls to lower pricing; both plans and checkout preview keep their existing behavior and confirmed USD prices.

## Accounts, orders and referrals (2026-10-31)
- User requests Google/Apple federated login, account system, customer orders, order admin and affiliate links.
- Use the existing craftos.app backend at the user's explicit request. Its checkout is `/Volumes/DevSSD/Projects/Onelaser自动化项目/github-release/onelaser-workos-api` (Fastify/PostgreSQL). Do not introduce Supabase. Keep CalDock data/identities/cookies isolated from Work OS.
- Affiliate default approved: personal links, source/order attribution, admin-set commission rate, no automatic payouts.
- Demo must be explicit and fictional; real accounts must not accept demo login. Paid order state and commissions require verified backend payment events, not a client success flag.

## Real company and team context (2026-10-31)
- User explicitly confirmed: CalDock is operated by the OneLaser team.
- Add a credible operator/team section before pricing, using the supplied OneLaser California office photo and the genuine team photo from OneLaser's official About Us page. Add an in-page team anchor and compact operator links at pricing/checkout.
- Preserve the supplied photographs. Do not generate people, fabricate endorsements, transfer laser-product warranties to Mac rentals, or label the office photo as a server-room photo.
- Verified public office address: 20472 Crescent Bay Dr, STE 104, Lake Forest, CA 92630, USA. Source: https://www.1laser.com/pages/contact-us and the site footer, read 2026-10-31.

## Motion preservation (2026-11-01)
- Preserve the reference's motion when restyling: moving network dashes (horizontal desktop / vertical phone), staggered section entrances, rotating remote-window glow, stock count/sweep/glints and the scrolling hint.
- Do not replace animated gradient tracks with solid backgrounds, globally disable reveal animations for screenshot capture, or hide animated window borders. Keep the selected espresso/amber colors and photo composition.
- Respect the visitor's reduced-motion preference; content and the final inventory count must remain readable without animation.

## Three billing plans (2026-11-01)
- Follow the supplied screenshot: 灵活月付 $199/月, 项目季付 $169/月, 长期年付 $129/月 with 主推 badge. Three adjacent charcoal/blue-gray price cards on desktop, stacked on phones; surrounding page keeps the current warm palette and motion.
- Exact upfront charges are $199/month, $507/quarter (3 months), and $1,548/year (12 months). Annual saves $840 versus twelve monthly payments; quarter saves $90 versus three monthly payments. This supersedes all older two-plan/annual-price instructions.
- Preserve the chosen interval through checkout, language switching, login callbacks and order/admin displays. The backend determines prices; never reprice existing order or commission snapshots.

## Operator video (2026-11-01)
- Place the user-selected official OneLaser video `tSroh4OUkX4` immediately below the office/team photo grid and above company details, in both languages. Use a responsive 16:9, lazy-loaded YouTube embed without autoplay, plus a YouTube fallback link.
- Describe it accurately as OneLaser's expanded production facility, not a CalDock server room or Mac hosting facility. Preserve existing photos and animations.
