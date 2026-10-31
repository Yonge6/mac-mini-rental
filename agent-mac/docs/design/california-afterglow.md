# California Afterglow

The user selected the second displayed Product Design concept on 2026-10-31. The landing page uses an espresso surface, ivory type, amber actions, sunset-lit aluminum photography and bold editorial headings. The CalDock mark remains unchanged.

## Design tokens

- Page: `#120e0b`; raised surface: `#201912`.
- Primary text: `#f4eee1`; secondary text: `#b8ac9b`.
- Action/accent: `#ffad47`.
- Existing local Geist and Geist Mono fonts; platform CJK fallback.

Hero copy and inventory are editable HTML, over an independently generated image. Mobile moves the photo below copy. Payment selection stays after the product story. Chinese/English and both confirmed USD plans retain their existing routes and state. Content is immediately visible, without delayed section reveals.

## Generated assets

Both images were generated with the built-in ImageGen tool from the selected mock, then exported as WebP. Original PNGs and prompt records are preserved in the local SSD QA archive. No UI text is baked into either image.

- `public/assets/afterglow-hero.webp`: 1440 × 1090, sunset and dedicated Mac.
- `public/assets/afterglow-fleet.webp`: 1440 × 820, sunset-lit Mac fleet.

### Hero prompt

Built-in ImageGen; reference: ../style-proposals-2026-10-31/02-california-afterglow.png
Generate a 1440 x 1090 CalDock California Afterglow full-bleed hero artwork, no text/UI/logo. Deep dark espresso left 48% for editable copy, California dusk mountains/palms/skyline and giant golden sun on right, one compact silver Mac mini in right half with warm golden rim light, fully visible two USB ports/status light/round jack. Entire lower 20% near-black for editable stock UI, dark top edge for header seam. Actual final input prompt retained in the generation tool call.


### Fleet prompt

Built-in ImageGen. Reference: qa/style-proposals-2026-10-31/02-california-afterglow.png.
Use case: product-mockup. Asset type: full-width photographic feature background for CalDock landing-page section, no interface. Recreate only lower-section Mac mini fleet artwork, not webpage. Target 1440 x 820 landscape. Several silver compact Mac minis on deep dark rock/slate surface; one hero Mac center-right with soft amber sunset reflection, darker out-of-focus machines behind and at far right. Three-quarter high-end aluminum product photography, two slim dark vertical USB-C ports at left, tiny white light and round black jack at right. Main machine center 76% horizontal and 51% vertical, width about 38%. Left 47% nearly black espresso #120e0b low detail for editable headline; edges blend espresso. Restrained amber golden rim light, dark cinematic shadow detail, no neon. No text, logos, labels, lines, stock meter, UI, buttons, people or other gadgets. Date anchor 2026-10-31, no dates visible.

