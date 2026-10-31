# CalDock team login with DingTalk

The shared Studio uses OneLaser's existing DingTalk application, enterprise membership checks and one-hour HttpOnly session. The GitHub Pages calculator links to the shared workspace on craftos.app; local planning remains independent.

## Login and identity

The existing OAuth start route accepts the fixed `caldock-studio` destination. It stores that destination with the one-use state and browser nonce. After the existing provider checks, the callback returns to the fixed Studio team tab, preserving Chinese or English. Arbitrary return URLs are not supported, and the existing Bot OAuth continuation remains separate.

Studio maps a verified WorkOS user to a dedicated stable CalDock actor for history. It never merges identities by email or name and never issues a commerce session. The existing session, active status, configured corporation and department/person scope are rechecked for Studio access and inside write transactions.

## Permissions

Public visitors can read plans and history. The first Studio visit records verified team members as viewers; explicitly configured DingTalk administrators bootstrap owners. Owners can grant editor, viewer or owner access through the existing member controls. Deletion does not trigger automatic enrollment on a later visit. Bootstrap owner access is constrained when the source administrator no longer qualifies. Existing manually granted CalDock memberships continue to work.

## Interaction and recovery

The team tab offers DingTalk login, shows the authenticated name and role, and lets owners choose members who have signed in. Login does not import local plans. Expired or revoked sessions stop writes while preserving the pending draft; the user can sign in again, refresh access or export. Sign-out uses the appropriate source session route and explicitly explains that DingTalk sign-out also ends the browser's OneLaser session.

## Verification and release

Exercise fixed OAuth returns, state/nonce/replay protection, Bot compatibility, actor stability, viewer/owner ACL, revocation, source-session expiry, CSRF and commerce isolation. Frontend checks cover login links in both languages, drafts, permission refresh and provider-specific logout. Publish the frontend through GitHub Pages, pin its immutable revision in the backend, run CI and deploy the exact backend commit to Render. Confirm public state preservation and the actual DingTalk authorization page; distinguish a deployed integration from a user-completed QR login.
