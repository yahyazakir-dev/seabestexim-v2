# Working on this repo

@AGENTS.md

- Read `PRODUCT.md` first: product truth, what may and may not be claimed (no facility, capacity or certification claims).
- Content lives in `content/*.ts`; pages only arrange it. Change copy there.
- Visual direction is in `.impeccable/surfaces/app-page-tsx.md`. Keep the deep-ocean navy + teal world, Unbounded/Onest type, authored SVG fish.
- After UI changes: `npm run build`, serve `out/`, and screenshot at 390x844 and 1440x900 at minimum. The parade must keep every fish level at rest and the reduced-motion fallback readable.
- Run `.claude/skills/impeccable/scripts/impeccable detect --json app components` before committing UI work.
