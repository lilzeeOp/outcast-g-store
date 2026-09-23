# Outcast G Store

Digital game key storefront built with React + Vite. Live at https://outcast-g-store.vercel.app

## Develop

```
npm install
npm run dev      # http://127.0.0.1:5173
npm run build    # production build in dist/
npm run lint
```

## Catalogue

Two sources feed the store:

- `src/data/products.js` — curated products (spotlight AAA titles, memberships, consoles). Ships in the bundle.
- `public/data/steam-catalog.json` — the top Steam games by ownership from SteamSpy, paid titles only.
  Loaded lazily by `src/data/catalog.js` on the PC / Deals pages, product pages and search.

Refresh the Steam catalogue (about one minute per 1,000 games because of SteamSpy's rate limit):

```
node scripts/fetch-steam-catalog.mjs 10
```

Games are priced by tier — Tier 1 ₹1,499, Tier 2 ₹999, Tier 3 ₹499 — assigned from Steam popularity and list price (`tierFor` in `products.js`). Vaults are tied to a tier (`bundles.js`).

## Contact links

`src/lib/contact.js` holds the Telegram handle and WhatsApp number used by every Buy button.

## Deploy

```
npx vercel --prod
npx vercel alias set <deployment-url> outcast-g-store.vercel.app
```
