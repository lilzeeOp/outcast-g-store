// Telegram bot webhook for Outcast G Store (Vercel serverless function).
//
// Buyers reach the bot through deep links from the site, e.g.
//   https://t.me/OutcastGStoreBot?start=p_rdr2          (a product)
//   https://t.me/OutcastGStoreBot?start=v_pro-vault_50  (a vault order)
// Telegram sends "/start <payload>" here; we reply with a product-aware
// welcome and forward the lead to the store owner's chat.
//
// Environment variables (set on Vercel, never committed):
//   TELEGRAM_BOT_TOKEN       token from @BotFather
//   TELEGRAM_WEBHOOK_SECRET  random string; Telegram echoes it in a header
//   SELLER_CHAT_ID           the owner's Telegram chat id for lead forwarding
import { PRODUCTS, discountPct, formatINR } from '../src/data/products.js';
import { BUNDLES } from '../src/data/bundles.js';

const API = (method) => `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/${method}`;
const SITE = 'https://outcast-g-store.vercel.app';
const CDN = 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/';

let catalogCache = null;
async function findProduct(id) {
  const curated = PRODUCTS.find((p) => p.id === id);
  if (curated) return curated;
  const m = /^s(\d+)$/.exec(id);
  if (!m) return null;
  if (!catalogCache) {
    const res = await fetch(`${SITE}/data/steam-catalog.json`);
    const data = await res.json();
    catalogCache = new Map(data.rows.map((r) => [r[0], r]));
  }
  const row = catalogCache.get(Number(m[1]));
  if (!row) return null;
  const was = row[2] / 100;
  return { id, name: `${row[1]} PC`, was, now: Math.round(was * 0.4 * 100) / 100, image: `${CDN}${row[0]}/header.jpg` };
}

function inr(n) {
  return '₹' + n.toLocaleString('en-IN');
}

function esc(s) {
  return String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
}

async function tg(method, body) {
  const res = await fetch(API(method), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json().catch(() => ({}));
}

// Build the buyer-facing welcome + the owner-facing lead from a start payload.
export async function compose(payload, from) {
  const who = from?.first_name ? `Hi ${esc(from.first_name)}! ` : 'Hi! ';
  const name = [from?.first_name, from?.last_name].filter(Boolean).join(' ') || 'Someone';
  const handle = from?.username ? ` (@${from.username})` : '';

  if (payload?.startsWith('p_')) {
    const p = await findProduct(payload.slice(2));
    if (p) {
      const off = discountPct(p);
      const title = p.name.replace(/ PC$/, '');
      return {
        welcome:
          `${who}Welcome to <b>Outcast G Store</b> 🎮\n\n` +
          `You're asking about <b>${esc(title)}</b>\n` +
          `💰 <b>${formatINR(p.now)}</b>  <s>${formatINR(p.was)}</s>  (${off}% off)\n\n` +
          `A team member will confirm stock, payment and delivery here shortly. ` +
          `Keys are delivered in this chat, usually within minutes.\n\n` +
          `Want to add more games? Just tell us the titles.`,
        lead: `🛒 <b>New enquiry</b>\n${esc(name)}${esc(handle)} wants <b>${esc(title)}</b> at ${formatINR(p.now)} (list ${formatINR(p.was)}).`,
        image: p.image,
      };
    }
  }

  if (payload?.startsWith('v_')) {
    const [, tier, count] = payload.split('_');
    const b = BUNDLES.find((x) => x.id === tier);
    if (b) {
      return {
        welcome:
          `${who}Welcome to <b>Outcast G Store</b> 🎮\n\n` +
          `You're ordering the <b>${esc(b.name)}</b> — ${b.count} Steam keys for a flat <b>${inr(b.price)}</b>.\n\n` +
          `Please paste your game list now (tap <b>Copy your game list</b> on the site, then paste it here). ` +
          `We'll confirm stock and payment, then deliver the keys in this chat.`,
        lead: `🧰 <b>New vault order</b>\n${esc(name)}${esc(handle)} is ordering the <b>${esc(b.name)}</b> (${count || b.count} games) for ${inr(b.price)}. Their list should follow.`,
      };
    }
  }

  return {
    welcome:
      `${who}Welcome to <b>Outcast G Store</b> 🎮\n\n` +
      `Genuine Steam keys, memberships and gift cards at up to 60% off, delivered in this chat.\n\n` +
      `Tell us which game you're after, or browse the store: ${SITE}`,
    lead: `👋 <b>New chat</b>\n${esc(name)}${esc(handle)} opened the bot without a product.`,
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(200).json({ ok: true, bot: 'OutcastGStoreBot' });
    return;
  }
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (secret && req.headers['x-telegram-bot-api-secret-token'] !== secret) {
    res.status(401).json({ ok: false });
    return;
  }

  const update = req.body || {};
  const msg = update.message || update.edited_message;
  if (!msg || !msg.chat) {
    res.status(200).json({ ok: true });
    return;
  }

  // Dry run for our own tests: returns the composed texts without sending.
  if (req.query?.dry === '1' && req.headers['x-telegram-bot-api-secret-token'] === secret) {
    const start = /^\/start(?:\s+(\S+))?/.exec(msg.text || '');
    res.status(200).json(await compose(start ? start[1] : null, msg.from));
    return;
  }

  const seller = process.env.SELLER_CHAT_ID;
  const text = msg.text || '';
  const start = /^\/start(?:\s+(\S+))?/.exec(text);

  try {
    if (start) {
      const { welcome, lead, image } = await compose(start[1], msg.from);
      if (image) {
        await tg('sendPhoto', { chat_id: msg.chat.id, photo: image, caption: welcome, parse_mode: 'HTML' });
      } else {
        await tg('sendMessage', { chat_id: msg.chat.id, text: welcome, parse_mode: 'HTML', disable_web_page_preview: true });
      }
      if (seller && String(msg.chat.id) !== String(seller)) {
        await tg('sendMessage', { chat_id: seller, text: `${lead}\n\nReply to them: tg://user?id=${msg.from?.id}`, parse_mode: 'HTML' });
      }
    } else if (seller && String(msg.chat.id) !== String(seller)) {
      // Any other buyer message: forward it to the owner so nothing is missed.
      await tg('forwardMessage', { chat_id: seller, from_chat_id: msg.chat.id, message_id: msg.message_id });
    }
  } catch (err) {
    console.error('telegram webhook error', err);
  }
  res.status(200).json({ ok: true });
}
