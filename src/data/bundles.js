// Flat-priced "vault" bundles: pick that many games from the whole Steam
// catalogue for one flat INR price.
export const BUNDLES = [
  {
    id: 'starter-vault',
    name: 'Starter Vault',
    count: 100,
    price: 599,
    tag: 'Entry pick',
    tint: ['#0a2f5c', '#03101f'],
    accent: '#38bdf8',
    blurb: '100 games of your choice from our full catalogue, for one flat price.',
    features: ['100+ games, you choose', 'Any tier, any genre', 'Delivered within 24h', 'Activates on Steam'],
  },
  {
    id: 'pro-vault',
    name: 'Pro Vault',
    count: 300,
    price: 799,
    tag: 'Best value',
    tint: ['#0b3b78', '#04142c'],
    accent: '#3aa6ff',
    highlight: true,
    blurb: '300 games of your choice — a whole library for less than the price of three.',
    features: ['300+ games, you choose', 'Any tier, any genre', 'Priority delivery', 'Activates on Steam'],
  },
  {
    id: 'ultimate-vault',
    name: 'Mega Vault',
    count: 500,
    price: 999,
    tag: 'Lowest per game',
    tint: ['#0d2749', '#020712'],
    accent: '#7cc6ff',
    blurb: '500 games of your choice — the biggest vault we offer, for one flat price.',
    features: ['500+ games, you choose', 'Any tier, any genre', 'Priority delivery', 'Activates on Steam'],
  },
];

export function findBundle(id) {
  return BUNDLES.find((b) => b.id === id);
}

export function perGame(bundle) {
  return Math.round(bundle.price / bundle.count);
}
