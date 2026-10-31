# Three-plan pricing QA — 2026-11-01

Source: `/var/folders/vd/kws8fm5509l6b9hnywhd8yfr0000gn/T/codex-clipboard-84372dda-d994-476f-a021-b6307d818629.png`, preserved as `qa/pricing-2026-11-01/reference.png` in the canonical SSD project. Source is a 1488 × 98 partial crop of three card headers; the third card is clipped. Its original page viewport/density is unknown. Compare the supplied header content, not an invented full-page design.

Implementation: http://localhost:4174/?lang=zh&interval=month#pricing. Desktop CSS viewport 1488 × 1050; full-page capture is 1488 × 11451 pixels (density 1). Three equal 426px cards within the existing 1310px content region. The source crop has wider cards and no complete frame; responsive card widths and added explicit totals/selection controls are intentional functional adaptations.

Evidence in the canonical SSD project's `qa/pricing-2026-11-01/`: `pricing-full.png`, `pricing-desktop.png`, `pricing-header-comparison.png`, `pricing-header-comparison-final.png`, `pricing-comparison-full.png`, `pricing-mobile.png`, `quarter-checkout.png`, `quarter-order-detail.png`. The full comparison puts the entire supplied crop and the complete implemented row in one image. Focused comparison aligns three 204 × 98 header regions without stretching; the source's first card is already clipped 9px at its left edge, so the matching first implementation crop removes that inset too.

## Comparison history

1. [P2] Initial header-to-price spacing was too loose. The initial focused comparison showed an extra gap from the fixed 34px heading height and 9px price margin.
2. Remove the fixed height/margin and retain natural line heights, including the featured badge. Final focused and complete-row comparisons verify the fix. No actionable P0/P1/P2 issues remain.

## Required surfaces

- Typography: source's monospace price style and strong optical weight retained with `ui-monospace`, 36px/600; gray 18px labels and `/月` units. Correct Chinese titles, three prices and 主推 badge. Surrounding bold page headings remain unchanged.
- Layout: equal desktop cards, 16px gaps, aligned totals and selection controls; phone stacks cards. Configuration details remain below the row in three desktop columns / two phone columns. No document overflow at 1488px or 390px.
- Colors: use the existing source component's charcoal #141b25, line #2b3443, text #eaf0fa, muted #97a6bd and blue #79a2ff. Annual remains featured. The active radio adds a distinct selection border; the surrounding page retains its warm palette.
- Assets: supplied reference contains only text and standard card/selection UI; no image generation or new icons are needed. Existing check asset and brand/product assets remain intact.
- Copy: monthly $199, quarterly $169/month with $507 upfront, yearly $129/month with $1,548 upfront. No old annual discount/amount remains in current checkout copy. Annual saving $840 and quarterly saving $90 are exact comparisons with monthly billing.

## Functional verification

- Monthly / quarterly / annual selection updates amount, terms, URL and checkout target. Keyboard arrow selection works.
- Quarterly checkout shows $507.00 and 3 months; login return and customer demo preserve `interval=quarter`.
- A fictional quarterly order was created and its detail displays 季付 and $507; no charge occurred.
- English phone layout and Chinese language switching preserve quarterly selection.
- Frontend price/currency, routing and calendar month-end tests passed, along with existing hosting contracts and production build.
- Backend typecheck and 20 CalDock/studio tests passed, including repeatable legacy migration, unchanged old order amount, new quarterly price, commission and exact three-calendar-month delivery period. Full PostgreSQL/container checks run before publication.
- No real payment or OAuth provider configuration is changed. Local unconfigured API requests are expected while using the standalone frontend; customer demo uses fictional local data.

Residual P3: source is a partial enlarged crop; exact original card width and device density cannot be reconstructed. Labels/values, internal hierarchy and colors are matched, with responsive widths fit to this landing page.

final result: passed
