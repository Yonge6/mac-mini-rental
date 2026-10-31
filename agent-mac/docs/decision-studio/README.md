# CalDock Decision Studio V4

- Public local calculator: https://yonge6.github.io/mac-mini-rental/decision-studio/
- Public shared document: https://craftos.app/decision-studio/

The supplied V4 HTML is separated into an entry, CSS, deterministic financial engine and UI. It is independent from the landing page and commerce prices. All example financial values are assumptions, not actual sales, inventory, costs or returns.

On 2026-11-01 the user changed viewing access to public. GitHub visitors can edit a browser-local copy without signing in. The shared document is also publicly readable; writing it requires an existing CalDock session and studio membership. The UI distinguishes local storage from real server updates. No private supplier data or credentials belong in either public defaults or the public shared document.

The existing craftos.app Fastify/PostgreSQL backend implements `/api/caldock/studio/health`, `state`, `me`, `members`, `history`, imports, restores and SSE `live`. It uses existing CalDock identity cookies, exact same-origin writes, CSRF, row locks, validated models, per-field revision preconditions and idempotent request IDs. PostgreSQL LISTEN/NOTIFY broadcasts across instances; SSE reconnects load a current snapshot. Unsent per-user drafts survive refresh within the browser session and remain separate from browser-local examples.

Team editing setup: configure the existing CalDock Google/Apple provider in private hosting configuration, sign in with the intended identities, and explicitly set `CALDOCK_STUDIO_OWNER_USER_IDS` to an approved existing CalDock user ID. There is no first-visitor owner, test password or anonymous write mode. Owners can grant/revoke existing-account membership in the UI. No invitations are sent. Missing provider configuration is displayed truthfully.

Run `npm run test:studio`, `npm run test:commerce`, `npm run test:sites`, and `npm run build` from `agent-mac/`. Backend coverage lives in `Yonge6/onelaser-workos-api/test/caldock-studio.test.ts` and runs both embedded and PostgreSQL adapters in CI. Local browser QA uses fictional accounts in an uncommitted, local-only harness, not production login credentials.

The supplied Markdown referenced a Python service, `INTEGRATION_CONTRACT.md` and tests that were not attached. The implementation therefore adapts the observable V4 UI protocol and independently tests transactions and authorization; it does not claim to have run the missing test suite.
