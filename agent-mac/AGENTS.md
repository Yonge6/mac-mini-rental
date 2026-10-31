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

- Latest pricing confirmed by the user: USD $199/month, crossed-out $249/month; annual $1,799 upfront, approximately $149.92/month, saving $589 versus 12 monthly payments. Describe the discount as approximate, never exact 25%.

- Header language control displays exactly 中 / En as direct local-language links, with the active language emphasized.

- Remove the entire boss-presentation promotion section (.hm-boss), including its illustration, presentation and PPT links. Pricing now flows directly into delivery.

- Do not use a credits, wallet balance or top-up concept anywhere. Describe direct payment, renewal payments and refunds in both Chinese and English.
- All heading levels and FAQ question titles are bold. The hero stock count is also bold, without changing its size or position.
- Use dark backgrounds throughout the page, header and checkout; no white page or navigation surface. Keep text readable with pale foregrounds and the blue active-section accent.

## Selected redesign (2026-10-31)
- User selected the second displayed Product Design mock: California Afterglow. Exact visual target: `../qa/style-proposals-2026-10-31/02-california-afterglow.png`.
- This choice replaces the earlier blue/graphite visual direction: use deep espresso surfaces, ivory type, amber actions and warm sunset photography throughout the landing page and checkout. Preserve the existing CalDock logo.
- Keep oversized bold left hero copy and right Mac/inventory composition. The hero reserve action scrolls to lower pricing; both plans and checkout preview keep their existing behavior and confirmed USD prices.
