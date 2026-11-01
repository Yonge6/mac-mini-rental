# Shared development instructions

Applies to Claude, Codex and human contributors. Read the nearest nested instructions before editing.

## Repository map

- `agent-mac/`: React 19 + Vite 6 frontend; run all npm commands here, not at repository root.
- `agent-mac/src/source.html`, `source.en.html`: paired Chinese/English landing markup, imported as raw HTML.
- `agent-mac/src/App.jsx`: mounts the landing, plan selection and checkout.
- `agent-mac/src/commerce/`: account/order/referral/admin UI, routing, demo data and billing definitions.
- `agent-mac/public/decision-studio/`: independent buildless planning UI; read its own `AGENTS.md`.
- Backend lives in `Yonge6/onelaser-workos-api`, not in this repository. See `docs/DEVELOPMENT.md`.

## Current product decisions

- Brand remains CalDock. The GRIDRUN rebrand was paused; PACE and other names are proposals, not approved replacements. Do not restore unpublished rename work without a new instruction.
- Preserve the existing California Afterglow page, premium warm-black/gold pricing, genuine OneLaser photos/video, responsive layout and motion. Respect reduced-motion preferences.
- Current page product copy uses California-only M6 Mac mini positioning. Changes to hardware specifications need an explicit product decision and verified source; do not invent availability or specifications.
- Prices: USD 199 monthly, 507 quarterly (169/month), 1548 yearly (129/month). Hero states the annual-equivalent starting price and the annual upfront charge clearly.
- Preserve both languages, interval selection across checkout/login, existing URLs and customer state. No credits, wallet or top-up terminology.
- Never equate a pending order or demo with a real payment. Paid status and commissions require verified server-side payment events.
- Studio scenarios, acquisition targets and simulated inventory are assumptions, not measured sales. Public viewing/local calculations do not grant shared-document write access. Preserve stored user edits.

## Working together

- Start each task from current remote `main`, on a separate branch. Existing repo conventions use `codex/`; follow the agent's branch requirement when applicable.
- Inspect status before changing files. Preserve other branches, dirty worktrees and unfinished merges; use a clean worktree when needed. Do not force-push or reset others' work.
- One task per PR. Describe the final behavior, validation and any deployment step; wait for relevant checks before merging. Do not merge unrelated pending brand work.
- Follow the user's current instruction about publishing. GitHub Pages deploys on `main`; merging a frontend PR does not publish the same version to craftos.app.
- Update the relevant guide when product decisions, commands, routing or publishing steps change. Never commit secrets, real account exports or private customer records.

## Validation

From `agent-mac/`: `npm run test:commerce`, `npm run test:studio`, `npm run test:sites`, `npm run build`. Run the checks relevant to code changes; documentation-only changes need link/command/diff checks, not a new test suite.
For visible UI changes, also inspect desktop and phone rendering, Chinese/English text, affected interactions and console errors. Report local verification and public publication separately.

## Storage on the owner's Mac

On Yongyuan's Mac, development source, worktrees, dependencies, caches, build/export/QA artifacts must stay on `/Volumes/DevSSD` (volume UUID `4782005C-E75C-406A-A195-A4A2AA8369C5`). Verify it is mounted before dependent writes; stop if absent rather than creating an internal substitute. Use `npm_config_cache=/Volumes/DevSSD/Caches/npm`. Preserve the existing compatibility links and Codex conversations/databases.
Claude's Linux cloud environment uses its provided workspace; do not create a fake `/Volumes/DevSSD` there.
