// Telegram handle confirmed (@OUTCASTGSTORE). TODO: replace the WhatsApp placeholder before going live.
export const TELEGRAM_USERNAME = 'outcastgstore';
// Buyers chat through the store bot so every click carries the product and
// gets an automatic, product-aware welcome (see api/telegram.js).
export const TELEGRAM_BOT = 'OutcastGStoreBot';
export const WHATSAPP_NUMBER = '910000000000'; // country code + number, no symbols

// payload: 'p_<productId>' for a product, 'v_<tier>_<count>' for a vault order.
export function telegramLink(payload) {
  const start = payload ? `?start=${encodeURIComponent(payload).slice(0, 64)}` : '';
  return `https://t.me/${TELEGRAM_BOT}${start}`;
}

export function whatsappLink(message) {
  const text = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}
