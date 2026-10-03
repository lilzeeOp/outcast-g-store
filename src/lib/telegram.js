// Telegram bot "Buy" links.
//
// The site opens https://t.me/outcastgstore_bot?start=<payload> and the bot
// creates an order from the payload. Telegram silently DROPS any start value
// that contains characters outside A-Z a-z 0-9 _ - or is longer than 64
// characters, so the payload must be built with exactly these rules (they
// mirror the bot's Python `build_product_payload`).
//
//   Name__Price__Discount__ListPrice
//
// Only the bot's username lives here. No tokens, no secrets.
export const TELEGRAM_BOT = 'outcastgstore_bot';
export const PAYLOAD_MAX = 64;
const INR_RATE = 83; // site prices are stored in USD-equivalent units

export function slugify(name) {
  return String(name)
    .trim()
    .replace(/_/g, '-')
    .replace(/[^A-Za-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Reference implementation. Strict: throws on empty names, non-integer
// numbers, or payloads over 64 characters. Must stay byte-identical in
// behaviour to the bot's /makelink output.
export function buildStartPayload(name, price = '', discount = '', listPrice = '') {
  const slug = slugify(name);
  if (!slug) throw new Error('product name is empty');

  const numbers = [price, discount, listPrice].map((v) => String(v ?? '').replace(/[₹,]/g, '').trim());
  for (const v of numbers) {
    if (v && !/^\d+$/.test(v)) throw new Error(`not a whole number: ${v}`);
  }

  const fields = [slug, ...numbers];
  while (fields.length > 1 && !fields[fields.length - 1]) fields.pop();
  const payload = fields.join('__');
  if (payload.length > PAYLOAD_MAX) throw new Error(`payload is ${payload.length} chars (max 64)`);
  return payload;
}

export const buyLink = (p) =>
  `https://t.me/${TELEGRAM_BOT}?start=${buildStartPayload(p.name, p.price, p.discount, p.listPrice)}`;

// ---------------------------------------------------------------------------
// Site-side helpers: turn a catalogue product into a payload that always fits.
// ---------------------------------------------------------------------------

// Whole rupees from the site's internal price unit.
export const rupees = (usdLike) => Math.round(usdLike * INR_RATE);

function displayName(product) {
  return (product.shortName || product.name).replace(/ PC$/, '');
}

// Shorten a slug to `max` characters without cutting a word in half when we
// can avoid it. Falls back to a hard cut for a single very long word.
function fitSlug(slug, max) {
  if (slug.length <= max) return slug;
  const cut = slug.slice(0, max);
  const at = cut.lastIndexOf('-');
  const trimmed = at >= Math.floor(max * 0.5) ? cut.slice(0, at) : cut;
  return trimmed.replace(/-+$/g, '');
}

// Builds { name, price, discount, listPrice } for a product, with the name
// shortened as needed so the final payload is <= 64 chars. Never throws for
// catalogue data: empty slugs (non-Latin titles) fall back to the Steam app id.
export function productPayloadFields(product) {
  const price = String(rupees(product.now));
  const off = product.was > product.now ? Math.round((1 - product.now / product.was) * 100) : 0;
  const discount = off > 0 ? String(off) : '';
  const listPrice = off > 0 ? String(rupees(product.was)) : '';

  let slug = slugify(displayName(product));
  if (!slug) {
    const appId = product.steamAppId || /^s(\d+)$/.exec(product.id)?.[1];
    slug = appId ? `Steam-App-${appId}` : slugify(product.id) || 'Game';
  }

  const tail = ['', price, discount, listPrice];
  while (tail.length > 1 && !tail[tail.length - 1]) tail.pop();
  const tailLen = tail.join('__').length; // includes the leading "__"
  slug = fitSlug(slug, PAYLOAD_MAX - tailLen);
  return { name: slug, price, discount, listPrice };
}

export function productStartPayload(product) {
  const f = productPayloadFields(product);
  return buildStartPayload(f.name, f.price, f.discount, f.listPrice);
}

export function productBuyLink(product) {
  return `https://t.me/${TELEGRAM_BOT}?start=${productStartPayload(product)}`;
}

// Two games bought together: one order line, combined price.
export function pairBuyLink(a, b) {
  const combined = {
    id: `${a.id}+${b.id}`,
    name: `${displayName(a)} + ${displayName(b)}`,
    now: a.now + b.now,
    was: a.now + b.now, // no discount claim on a pair
  };
  return productBuyLink(combined);
}

// Vault / bundle: flat INR price, no discount fields.
export function bundleBuyLink(bundle) {
  const slug = fitSlug(slugify(bundle.name), PAYLOAD_MAX - `__${bundle.price}`.length);
  return `https://t.me/${TELEGRAM_BOT}?start=${buildStartPayload(slug, String(bundle.price))}`;
}

export function botLink() {
  return `https://t.me/${TELEGRAM_BOT}`;
}
