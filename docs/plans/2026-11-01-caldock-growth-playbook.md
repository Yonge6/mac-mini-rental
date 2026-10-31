# CalDock multi-channel growth playbook

Goal: make marketing and sales an actionable, bilingual 90-day plan covering high-value individuals, enterprise partners, software partnerships, content, referrals and assisted outreach.

Use a versioned public playbook above the saved execution plan. Keep schema 4 and all financial calculations. Existing local/shared edits remain untouched; adopting the new editable template requires an explicit click and uses existing history, membership checks and conflict handling. Fresh local plans use the new template. No automated external communication occurs.

Implementation:
1. Verify official account/region and messaging constraints; distinguish permitted service bundles from unverified resale. Record sources and dates in the playbook.
2. Add `growth-content.js` (bilingual business plan), `growth-playbook.js` (accessible renderer/export), `growth.css` and `growth-template.js` (schema-compatible editable defaults).
3. Integrate the playbook, direct marketing URL, Markdown export, accordion controls and explicit template adoption into `studio.js` and `index.html`. Distinguish website sales prices from financial assumptions. Correct the simplified funnel metric so customer counts, device capacity and cost scope are separate.
4. Validate financial regressions, fresh/existing browser state, adoption/history, language switching, export and mobile width. Build and run existing hosting/commerce tests.
5. Publish GitHub Pages, update only the backend's frontend revision pin, deploy a tested main descendant without reverting concurrent changes, and read both public hosts back.

Files outside Decision Studio and its docs/tests must not be changed by the frontend release. Preserve the existing public read/protected shared write model. No customer contacts or private supplier details belong in this public plan.

Release integration: the parallel website task approved monthly $199, quarterly $507 and yearly $1,548 pricing in frontend commit `c10df2181056cb870985039fe3887c041d78e5c6` and backend commit `d8dc57283fad4c4401f1e979b5d62432523661a5`. Preserve these changes when resolving the shared deployment pin. Align sales copy and partner examples to the approved catalog without changing existing financial scenarios or historical orders.
