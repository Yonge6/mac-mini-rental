# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## User decisions (2026-10-31)
- Preserve the Agent.Space reference page's design, content structure and original assets.
- Hosting region is 美国加州 only. Remove Europe and random location allocation everywhere, including hidden FAQ and accessible labels.
- Product is M6 Mac mini. Apple official specifications verified: 12-core CPU, 12-core GPU; keep 16GB unified memory and 256GB SSD.
- Show both monthly ($160/month) and annual ($1,440 upfront, $120/month) on the same page, following the user-provided pricing screenshot. Select inline, then go directly to the payment page. Do not route through the reference site's billing page.
- Real collection is not configured yet. Never claim payment succeeded when no payment provider was used.
- The user requested a GitHub-hosted URL. Publish this preview through GitHub Pages. Keep relative asset URLs and query-based checkout routing so repository subpaths and direct refresh work.
