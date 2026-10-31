# Reference motion restoration — 2026-11-01

Preserve the selected espresso/amber palette and photographic composition while retaining the reference page's motion. No new dependency or backend behavior is required.

## Changes

- Remove the redesign's blanket `animation: none` / `opacity: 1` override on reveal items. Existing IntersectionObservers and the original staggered `site-rise` now control entrances, including the first feature's copy.
- Restore repeating network gradients. Desktop uses the original horizontal `hm-flow`; the existing 64rem stacked breakpoint uses vertical `hm-flow-down`. Solid color overrides had made the animation invisible even though it was running.
- Restore the remote window's rotating conic border, using the selected warm palette rather than hiding its pseudo-elements.
- Reuse the original registered inventory counter, sweep and glint keyframes for the redesigned stock rail. The accessible meter remains fixed at 88 rented / 12 remaining. Restore the original scrolling hint and closing stock-fill bar.
- Keep reduced-motion rules, including explicit pseudo-element overrides. The final stock count remains 12 when animations are disabled. Do not disable motion globally for screenshots.

## Browser checks

Codex in-app browser, desktop 1383 × 1106 and phone 390 × 844, Chinese and English.

- Desktop network backgrounds were sampled at different positions (4.63 → 37.96px and 28.43 → 23.30px), with repeating gradients and `hm-flow` active.
- Phone networks use vertical gradients and `hm-flow-down`; Y offsets changed between samples. No document overflow.
- Remote border angle changed from −158.93° to −75.02°, and its pseudo-element is displayed. The section changes to `in-view` and `site-rise` runs after navigating to it.
- Fresh hero count begins at 100 and settles at 12; final font weight is 700. The scroll hint uses `hm-nudge`, and available marks use `hm-board-glint`.
- Reduced-motion CSS was inspected; the operating system preference was not changed during QA.
- Production build plus existing hosting and commerce contracts run before publication.

Screenshots and motion evidence are stored under the SSD QA directory `qa/motion-2026-11-01/`.
