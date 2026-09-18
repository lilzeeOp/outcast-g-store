// Flat-priced "vault" bundles — a common pattern for chat-based game key
// outlets: pay once, get a batch of keys/accounts delivered over Telegram or
// WhatsApp. Prices are set directly in INR (not converted from a USD base
// like single games) since these are bundle-specific deals, not per-title.
export const BUNDLES = [
  {
    id: 'starter-vault',
    name: 'Starter Vault',
    count: 30,
    price: 499,
    was: 799,
    tag: 'Entry Pick',
    tint: ['#123a4d', '#04121a'],
    accent: '#17c3c9',
    blurb: 'A solid mixed-genre starter pack — indies, shooters, and a few surprise hits.',
    features: ['30+ PC game keys', 'Mixed genres, hand-picked', 'Delivered within 24h', 'Steam-activatable keys'],
  },
  {
    id: 'pro-vault',
    name: 'Pro Vault',
    count: 50,
    price: 799,
    was: 1399,
    tag: 'Best Value',
    tint: ['#3a1240', '#150420'],
    accent: '#ff2d55',
    highlight: true,
    blurb: 'The one most people pick — a bigger spread with more AAA titles mixed in.',
    features: ['50+ PC game keys', 'More AAA titles included', 'Priority delivery', 'Steam-activatable keys'],
  },
  {
    id: 'ultimate-vault',
    name: 'Ultimate Vault',
    count: 99,
    price: 1499,
    was: 2999,
    tag: 'Best Per-Game Price',
    tint: ['#5c2c0e', '#160a02'],
    accent: '#f3b93b',
    blurb: 'The whole vault — for players who want maximum library size for minimum spend.',
    features: ['99+ PC game keys', 'Lowest price per game', 'Priority delivery', 'Steam-activatable keys'],
  },
];

export function findBundle(id) {
  return BUNDLES.find((b) => b.id === id);
}
