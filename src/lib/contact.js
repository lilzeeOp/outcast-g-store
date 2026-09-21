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
