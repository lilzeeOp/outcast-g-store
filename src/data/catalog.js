import { useEffect, useState } from 'react';
import { PRODUCTS, hash, registerCatalog } from './products';

// The big Steam catalogue: top games by ownership, built by
// scripts/fetch-steam-catalog.mjs into public/data/steam-catalog.json.
// Loaded lazily (once) because it is a few hundred KB; curated PRODUCTS
// stay in the main bundle so the home page never waits on it.

const DISCOUNT = 0.6; // flat 60% off list, same as the curated catalogue
const CDN = 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/';

let promise = null;
let ITEMS = [];

function appIdOf(product) {
  const m = /steam\/apps\/(\d+)\//.exec(product.image || '');
  return m ? Number(m[1]) : null;
}

function toProduct([appid, name, listCents, positive, negative], rank) {
  const was = listCents / 100;
  const hue = hash(String(appid)) % 360;
  const total = positive + negative;
  return {
    id: `s${appid}`,
    steamAppId: appid,
    name: `${name} PC`,
    platform: 'steam',
    category: 'pc',
    tag: rank < 300 ? 'Top Seller' : rank < 2000 ? 'Popular' : 'Steam Key',
    was,
    now: Math.round(was * (1 - DISCOUNT) * 100) / 100,
    cover: [`hsl(${hue}, 45%, 20%)`, `hsl(${hue}, 45%, 7%)`],
    image: `${CDN}${appid}/header.jpg`,
    os: ['windows'],
    reviews: { positive, negative, total },
    rank,
  };
}

export function loadCatalog() {
  if (!promise) {
    promise = fetch('/data/steam-catalog.json')
      .then((r) => {
        if (!r.ok) throw new Error(`catalog ${r.status}`);
        return r.json();
      })
      .then((data) => {
        const curated = new Set(PRODUCTS.map(appIdOf).filter(Boolean));
        ITEMS = data.rows.filter(([appid]) => !curated.has(appid)).map(toProduct);
        registerCatalog(ITEMS);
        return ITEMS;
      });
  }
  return promise;
}

export function catalogItems() {
  return ITEMS;
}

// { items, ready } — `ready` flips true once the fetch settles (even on
// failure, so pages can fall back to the curated list instead of spinning).
export function useCatalog() {
  const [items, setItems] = useState(ITEMS);
  const [ready, setReady] = useState(ITEMS.length > 0);
  useEffect(() => {
    let live = true;
    loadCatalog()
      .then((list) => {
        if (live) setItems(list);
      })
      .catch(() => {})
      .finally(() => {
        if (live) setReady(true);
      });
    return () => {
      live = false;
    };
  }, []);
  return { items, ready };
}

// Simple title search across curated + catalogue products, best matches first.
export function searchProducts(query, limit = 6) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const score = (p) => {
    const n = p.name.toLowerCase();
    if (n.startsWith(q)) return 0;
    const idx = n.indexOf(q);
    if (idx === -1) return -1;
    return 1 + idx / 100 + (p.rank || 0) / 100000;
  };
  const out = [];
  for (const p of [...PRODUCTS, ...ITEMS]) {
    const sc = score(p);
    if (sc >= 0) out.push([sc, p]);
  }
  out.sort((a, b) => a[0] - b[0]);
  return out.slice(0, limit).map((x) => x[1]);
}
