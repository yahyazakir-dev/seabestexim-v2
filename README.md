# Sea Best Exim website

Marketing site for Sea Best Exim Pvt. Ltd., exporters of frozen seafood and pre-cooked tuna.
Next.js (App Router) with static export, hosted on Cloudflare Pages.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # static site in out/
npm run preview      # serve out/ on http://localhost:4000
```

## Where things live

| What | Where |
| --- | --- |
| Phone, email, address, hours | `content/site.ts` |
| Product range (from Product_lists.docx) | `content/products.ts` |
| "Why choose us", commitment, leadership | `content/company.ts` |
| Pages | `app/page.tsx`, `app/frozen-seafood/`, `app/pre-cooked-tuna/`, `app/pet-food/`, `app/about/` |
| Homepage fish sequence | `components/Parade.tsx` (order in `parade` in `content/products.ts`) |
| Styles and design tokens | `app/globals.css` (tokens), `app/sections.css` (sections) |
| SEO: metadata, JSON-LD, sitemap, robots | each page's `metadata`, `lib/seo.tsx`, `app/sitemap.ts`, `app/robots.ts` |

## Assets

- Fish illustrations are generated SVGs: edit `scripts/fish/species.ts`, then
  `node --experimental-strip-types scripts/build-fish.ts` (add `--preview` for a contact sheet in `.impeccable/`).
- Photos: put originals in `scripts/src-photos/`, then `npm run images` to write WebP sizes to `public/img/` and `lib/images.json`.
- Favicons and the social image: `node scripts/brand-assets.mjs`.

## Deploying to Cloudflare Pages

Option A, Git integration (no secrets needed): Cloudflare dashboard → Workers & Pages → Create → Pages →
Connect to Git → `seabestexim-v2`. Build command `npm run build`, output directory `out`, environment variable `NODE_VERSION=22`.

Option B, GitHub Actions: add repository secrets `CLOUDFLARE_API_TOKEN` (Pages: Edit) and `CLOUDFLARE_ACCOUNT_ID`, and create a
Pages project named `seabestexim`. Every push deploys; `.github/workflows/deploy.yml`.

Custom domain: Pages project `seabestexim` → Custom domains → `seabestexim.com` (+ `www`). The canonical URL is set in `content/site.ts`.

## Still to confirm with the customer

Search for `PLACEHOLDER`: street address, registration numbers, certifications, other directors' names and photos,
and real product photography (current photos are illustrative stand-ins).
