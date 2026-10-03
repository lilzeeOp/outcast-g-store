// Builds the Telegram start payload for EVERY product the site can sell
// (curated + the Steam catalogue + bundles) and fails if any payload throws,
// exceeds 64 characters, or contains a character Telegram would reject.
import { readFileSync } from 'node:fs';
import { PRODUCTS, TIERS, tierFor, INR_RATE } from '../src/data/products.js';
import { BUNDLES } from '../src/data/bundles.js';
import { productStartPayload, bundleBuyLink, PAYLOAD_MAX } from '../src/lib/telegram.js';

const SAFE = /^[A-Za-z0-9_-]+$/;
const rows = JSON.parse(readFileSync(new URL('../public/data/steam-catalog.json', import.meta.url), 'utf8')).rows;

// Same shape catalog.js builds in the browser (without React).
const catalogue = rows.map(([appid, name, listCents], rank) => {
  const was = listCents / 100;
  const tier = tierFor({ listUsd: was, rank });
  return { id: `s${appid}`, steamAppId: appid, name: `${name} PC`, was, now: TIERS[tier].price / INR_RATE, tier };
});

let failures = 0;
let shortened = 0;
let fallbacks = 0;
let longest = { len: 0 };

for (const p of [...PRODUCTS, ...catalogue]) {
  try {
    const payload = productStartPayload(p);
    if (payload.length > PAYLOAD_MAX) throw new Error(`length ${payload.length}`);
    if (!SAFE.test(payload)) throw new Error(`unsafe characters in ${payload}`);
    if (payload.startsWith('Steam-App-')) fallbacks++;
    const fullSlug = (p.shortName || p.name).replace(/ PC$/, '').replace(/_/g, '-').replace(/[^A-Za-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
    if (fullSlug && !payload.startsWith(fullSlug + '__')) shortened++;
    if (payload.length > longest.len) longest = { len: payload.length, payload, id: p.id };
  } catch (e) {
    failures++;
    console.error(`FAIL ${p.id} (${p.name}): ${e.message}`);
  }
}

for (const b of BUNDLES) {
  const link = bundleBuyLink(b);
  const payload = link.split('start=')[1];
  if (payload.length > PAYLOAD_MAX || !SAFE.test(payload)) {
    failures++;
    console.error(`FAIL bundle ${b.id}: ${payload}`);
  }
}

console.log(`checked ${PRODUCTS.length} curated + ${catalogue.length} catalogue products + ${BUNDLES.length} bundles`);
console.log(`names shortened to fit: ${shortened}; app-id fallbacks (non-Latin names): ${fallbacks}`);
console.log(`longest payload: ${longest.len} chars (${longest.id}) ${longest.payload}`);
if (failures) {
  console.error(`${failures} payload(s) invalid`);
  process.exit(1);
}
console.log('all payloads valid (<= 64 chars, Telegram-safe characters)');
