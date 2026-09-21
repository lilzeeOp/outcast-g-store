// Telegram handle confirmed (@OUTCASTGSTORE). TODO: replace the WhatsApp placeholder before going live.
export const TELEGRAM_USERNAME = 'outcastgstore';
export const WHATSAPP_NUMBER = '910000000000'; // country code + number, no symbols

// Opens the store's own Telegram chat with the message pre-typed (Telegram's
// `text` deep-link parameter). No bot in the middle: buyers talk to the team.
export function telegramLink(message) {
  const text = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://t.me/${TELEGRAM_USERNAME}${text}`;
}

export function whatsappLink(message) {
  const text = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

// ---------------------------------------------------------------------------
// Pre-typed chat messages. One voice everywhere: friendly, specific, and easy
// for the team to act on (game, price, link, what the buyer needs next).
// ---------------------------------------------------------------------------
const SITE = 'https://outcast-g-store.vercel.app';
const inr = (n) => '\u20b9' + Math.round(n).toLocaleString('en-IN');
const title = (p) => p.name.replace(/ PC$/, '');
const GREETING = 'Hi Outcast G Store! \ud83d\udc4b';
const CLOSE = 'Please confirm availability and how to pay. Thanks!';

export function productMessage(product) {
  const rate = 83;
  const now = inr(product.now * rate);
  const was = inr(product.was * rate);
  const off = Math.round((1 - product.now / product.was) * 100);
  return [
    GREETING,
    '',
    "I'd like to buy:",
    `\ud83c\udfae ${title(product)}`,
    `\ud83d\udcb0 ${now}  (${off}% off, list ${was})`,
    `\ud83d\udd17 ${SITE}/product/${product.id}`,
    '',
    CLOSE,
  ].join('\n');
}

export function pairMessage(a, b) {
  const rate = 83;
  return [
    GREETING,
    '',
    "I'd like to buy these two together:",
    `\ud83c\udfae ${title(a)}  -  ${inr(a.now * rate)}`,
    `\ud83c\udfae ${title(b)}  -  ${inr(b.now * rate)}`,
    `\ud83d\udcb0 Total ${inr((a.now + b.now) * rate)}`,
    '',
    CLOSE,
  ].join('\n');
}

export function bundleMessage(bundle) {
  const off = Math.round((1 - bundle.price / bundle.was) * 100);
  return [
    GREETING,
    '',
    `I'd like the ${bundle.name} \ud83e\uddf0`,
    `\ud83c\udfae ${bundle.count}+ Steam keys for a flat ${inr(bundle.price)}  (${off}% off ${inr(bundle.was)})`,
    `\ud83d\udd17 ${SITE}/bundles`,
    '',
    "I'm happy for you to pick the games. " + CLOSE,
  ].join('\n');
}

export function vaultMessage(bundle, titles, shareUrl, cap = 40) {
  const listed = titles.slice(0, cap).map((t, i) => `${i + 1}. ${t}`);
  const more = titles.length > cap ? [`\u2026and ${titles.length - cap} more`] : [];
  return [
    GREETING,
    '',
    `I'd like to order the ${bundle.name} \ud83e\uddf0`,
    `\ud83c\udfae ${bundle.count} Steam keys for a flat ${inr(bundle.price)}`,
    '',
    `My picks (${titles.length}):`,
    ...listed,
    ...more,
    `\ud83d\udd17 Full list: ${shareUrl}`,
    '',
    CLOSE,
  ].join('\n');
}

export function generalMessage() {
  return `${GREETING}\n\nI have a question about a game. Could you help?`;
}

export function helpMessage() {
  return `${GREETING}\n\nI need help with an order.\nGame: \nIssue: `;
}
