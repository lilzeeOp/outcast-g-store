import { useEffect, useState } from 'react';
import { INR_RATE, PRODUCTS, TIERS, hash, registerCatalog, tierFor } from './products';

// The big Steam catalogue: top games by ownership, built by
// scripts/fetch-steam-catalog.mjs into public/data/steam-catalog.json.
// Loaded lazily (once) because it is a few hundred KB; curated PRODUCTS
// stay in the main bundle so the home page never waits on it.

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
  const tier = tierFor({ listUsd: was, rank });
  return {
    id: `s${appid}`,
    steamAppId: appid,
    name: `${name} PC`,
    platform: 'steam',
    category: 'pc',
    tag: rank < 300 ? 'Top Seller' : rank < 2000 ? 'Popular' : 'Steam Game',
    was,
    now: TIERS[tier].price / INR_RATE,
    tier,
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

// ---------------------------------------------------------------------------
// Search. Understands the ways people actually type game names:
//   "gta" / "gta 5" / "gta v"   -> Grand Theft Auto V   (acronyms + numerals)
//   "cod mw2", "rdr2", "csgo"   -> Call of Duty: Modern Warfare 2, ...
//   "baldurs gate", "elden"     -> punctuation-insensitive, prefix per word
// Lower score = better match. -1 = no match.
// ---------------------------------------------------------------------------
const ROMAN = { ii: '2', iii: '3', iv: '4', v: '5', vi: '6', vii: '7', viii: '8', ix: '9', x: '10' };
const SKIP_IN_ACRONYM = new Set(['the', 'edition', 'definitive', 'complete', 'enhanced', 'remastered', 'directors', 'cut', 'goty', 'pc', 'year', 'deluxe', 'ultimate', 'standard', 'bundle', 'pack', 'us']);
const index = new WeakMap();

function normalize(str) {
  return str
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['’]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function tokenize(str) {
  return normalize(str)
    .split(' ')
    .filter(Boolean)
    .map((t) => (Object.hasOwn(ROMAN, t) ? ROMAN[t] : t));
}

function entry(p) {
  let e = index.get(p);
  if (!e) {
    const toks = tokenize(p.name.replace(/ PC$/, ''));
    const acro = toks
      .filter((t) => !SKIP_IN_ACRONYM.has(t))
      .map((t) => (/^\d+$/.test(t) ? t : t[0]))
      .join('');
    e = { norm: toks.join(' '), toks, acro };
    index.set(p, e);
  }
  return e;
}

export function matchScore(p, query) {
  const qtoks = tokenize(query);
  if (qtoks.length === 0) return -1;
  const qn = qtoks.join(' ');
  const compact = qtoks.join('');
  const e = entry(p);
  if (e.norm === qn) return 0;
  // Short queries are usually abbreviations ("cod", "gta", "ds3"): let the
  // acronym win over titles that merely start with those letters ("Code Vein").
  const short = compact.length <= 4;
  if (compact.length >= 2 && e.acro === compact) return 0.1;
  if (compact.length >= 3 && e.acro.startsWith(compact)) return short ? 0.1 : 0.6;
  if (e.norm.startsWith(qn + ' ') || e.norm.startsWith(qn)) return 0.2;
  const idx = e.norm.indexOf(qn);
  if (idx !== -1) return 1 + idx / 100;
  // Every query word is a prefix of some title word (any order).
  const allPrefix = qtoks.every((qt) => e.toks.some((t) => t.startsWith(qt)));
  if (allPrefix) return 2;
  // Acronym plus a trailing word/number, e.g. "gta online", "cod 4".
  if (qtoks.length >= 2 && compact.length >= 3) {
    const head = qtoks[0];
    const rest = qtoks.slice(1);
    if (e.acro.startsWith(head) && rest.every((qt) => e.toks.some((t) => t.startsWith(qt)))) return 2.5;
  }
  return -1;
}

export function matchesQuery(p, query) {
  return matchScore(p, query) >= 0;
}

// Ranked search across curated + catalogue products, best matches first.
export function searchProducts(query, limit = 8) {
  if (!query.trim()) return [];
  const out = [];
  for (const p of [...PRODUCTS, ...ITEMS]) {
    const sc = matchScore(p, query);
    if (sc >= 0) out.push([sc, p]);
  }
  out.sort((a, b) => a[0] - b[0] || (a[1].rank ?? -1) - (b[1].rank ?? -1));
  return out.slice(0, limit).map((x) => x[1]);
}

// Filter + order a list by query relevance (ties broken by popularity).
export function rankByQuery(list, query) {
  return list
    .map((p) => [matchScore(p, query), p])
    .filter((x) => x[0] >= 0)
    .sort((a, b) => a[0] - b[0] || (a[1].rank ?? -1) - (b[1].rank ?? -1))
    .map((x) => x[1]);
}
