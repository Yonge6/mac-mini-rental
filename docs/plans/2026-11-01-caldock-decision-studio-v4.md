# CalDock Decision Studio V4 Implementation Plan

**Goal:** Publish the supplied bilingual planning studio at an independent GitHub Pages path, with a separate public shared workspace with protected editing on craftos.app.

**Architecture:** Keep the supplied model, styles and interface. GitHub Pages hosts browser-local planning and links to craftos.app for same-origin private collaboration. Extend the existing Fastify/PostgreSQL service with isolated studio tables and existing CalDock sessions; use SSE with PostgreSQL NOTIFY for cross-instance updates. Do not change commerce pricing, orders, homepage or uncommitted motion work.

**Tech Stack:** Buildless HTML/CSS/JS, existing Vite static packaging, Fastify, PostgreSQL, SSE.

1. Extract the supplied HTML to `agent-mac/public/decision-studio/`; preserve financial formulas and bilingual examples. Verify all-annual eight-unit receipts 12384 and earned monthly revenue 1032.
2. Adapt team login to existing Google/Apple sessions. Remove reference password login. Show truthful provider availability, local-only status and authorization failures.
3. Add server-side member roles, validated field patches, row-locked transactions, idempotent requests, revision conflicts, shared history and append-only restores in the backend repository. Public reads per the user’s later decision; default-deny writes.
4. Add SSE with PostgreSQL notifications, reconnect snapshot and session revalidation. Keep unsent drafts in per-user session storage, explicitly resolve conflicts, and never upload local state at login.
5. Test model, authorization, Origin/CSRF, stale/same-field writes, independent-field merge, restore, persistence, role changes, real SSE and offline browser recovery. Check mobile and both languages.
6. Commit only task files; publish via GitHub Pages and backend CI/deploy. Read back public URLs and distinguish pending OAuth configuration and live two-account acceptance from implemented/local-tested behavior.

User decision during implementation: viewing is public for everyone; shared editing remains permission-controlled.

Known inputs missing: the referenced Python service, integration contract and original test suite were not attached. Live `/api/caldock/capabilities` reports Google and Apple disabled on 2026-11-01. Do not invent credentials or authorize unknown users.
