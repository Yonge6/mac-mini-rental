# Three billing plans

The user supplied a cropped pricing reference with three adjacent charcoal cards: 灵活月付 $199/月, 项目季付 $169/月, 长期年付 $129/月 with a blue 主推 badge.

- Use equal desktop cards and stacked phone cards. Match the supplied card color, typography and badge; preserve the surrounding warm theme and all restored motion.
- Monthly collects $199 for one month; quarterly collects $507 for three months; yearly collects $1,548 for twelve months. Show upfront totals before checkout. Keep one inline selection and the existing next-step checkout flow.
- Use one frontend plan registry for prices, labels, URL state, demonstrations and term lengths. Preserve quarterly selection through language switching and Google/Apple return paths.
- The server owns order amounts. Expand the existing database constraint idempotently to allow quarterly orders and start a three-calendar-month service period on delivery. Existing orders retain their original amount and commission snapshots.
- Verify pricing arithmetic, month-end handling, quarterly order/commission/delivery, legacy migration, customer preview, responsive layout and a source-vs-rendered comparison. Publish both GitHub Pages and the pinned craftos.app frontend after checks pass.
