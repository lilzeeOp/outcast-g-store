// Builds public/data/steam-catalog.json from SteamSpy's ownership-ranked list.
// Usage: node scripts/fetch-steam-catalog.mjs [pages=10]
// SteamSpy allows one `all` request per minute, so 10 pages takes ~10 minutes.
import { writeFileSync, mkdirSync } from 'node:fs';

const PAGES = Number(process.argv[2] || 10);
const rows = [];
const seen = new Set();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

for (let page = 0; page < PAGES; page++) {
  let data = null;
  for (let attempt = 0; attempt < 4 && !data; attempt++) {
    try {
      const res = await fetch(`https://steamspy.com/api.php?request=all&page=${page}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (catalog builder)' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      data = await res.json();
    } catch (e) {
      console.error(`page ${page} attempt ${attempt + 1} failed: ${e.message}`);
      await sleep(65000);
    }
  }
  if (!data) break;
  let kept = 0;
  for (const g of Object.values(data)) {
    const list = Number(g.initialprice || 0);
    if (!g.appid || !g.name || list <= 0 || seen.has(g.appid)) continue;
    seen.add(g.appid);
    rows.push([g.appid, String(g.name).replace(/�/g, '-'), list, Number(g.positive || 0), Number(g.negative || 0)]);
    kept++;
  }
  console.log(`page ${page}: ${Object.keys(data).length} rows, kept ${kept}, total ${rows.length}`);
  if (page < PAGES - 1) await sleep(61000);
}

mkdirSync('public/data', { recursive: true });
writeFileSync('public/data/steam-catalog.json', JSON.stringify({ fetched: new Date().toISOString().slice(0, 10), source: 'steamspy', rows }));
console.log(`wrote ${rows.length} games`);
