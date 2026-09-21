# Plan: blue theme, full Steam catalogue, mobile search

Date: 2026-09-21

## 1. Theme — logo blue

- Logo blue sampled from `public/brand/logo.png`: **#0fa7fa** (dark #0784c9, light #3ab8ff).
- Rename the accent tokens `--red / --red-dark / --red-light` to `--accent / --accent-dark / --accent-light`
  and point them at the blues. Replace every hard-coded `rgba(255,45,85,x)` glow with the blue equivalent.
- Shift the purple hero / bundle / newsletter gradients to navy-blue so they sit with the accent.
- Keep green for prices and gold for stars (they already contrast well with blue).

## 2. Catalogue — "all Steam games"

Why not literally every app: Steam lists roughly 100k+ apps, most are DLC, tools or shovelware,
the public app list has no prices, and per-app price lookups are rate-limited to ~200 per 5 minutes.
Shipping that to a browser is also impossible (tens of MB).

What we ship instead: the **top 10,000 Steam games by ownership** (SteamSpy `all` pages 0–9),
paid titles only, which covers every game a buyer will realistically search for.

- `scripts/fetch-steam-catalog.mjs` — fetches SteamSpy pages (1 request/minute limit), keeps paid
  games, writes a compact `public/data/steam-catalog.json` (`[appid, name, listPriceCents, positive, negative]`).
- `src/data/catalog.js` — `loadCatalog()` fetches the JSON once, maps rows to the product shape
  (id `s<appid>`, 60 % off list price, header image from the appid, real review counts), dedupes
  against the curated products, and registers them so `findProduct` works for catalogue ids.
- `useCatalog()` hook — `{ items, ready }` for pages.
- Category page: PC Games shows curated + catalogue, default sort "Most popular", page size 24,
  search filter over the full set. Header search searches the full catalogue once loaded.
- Product page: waits for the catalogue before deciding a `s<appid>` id is a 404.

## 3. Mobile search

- On phones the inline search input is squeezed between the hamburger and the logo.
- Replace it with a search icon button on small screens. Tapping opens a full-width search panel
  under the header with autofocus, live results and a close button. Desktop layout unchanged.

## Verification

- Browser checks at 1500px and 390px for the home, category, product and search flows.
- Catalogue: count loaded, a `s<appid>` product page renders, search finds a non-curated title.
- Lint + production build, then push to GitHub and deploy to Vercel.
