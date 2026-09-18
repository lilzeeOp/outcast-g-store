// TODO: swap these placeholders for the real handles before going live.
export const TELEGRAM_USERNAME = 'outcastgstore';
export const WHATSAPP_NUMBER = '910000000000'; // country code + number, no symbols

export function telegramLink() {
  return `https://t.me/${TELEGRAM_USERNAME}`;
}

export function whatsappLink(message) {
  const text = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}
