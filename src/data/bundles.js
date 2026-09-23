// Flat-priced "vault" bundles. Each vault is tied to a game tier: you pick
// that many games from that tier in the vault builder for one flat price.
// Prices are INR.
export const BUNDLES = [
  {
    id: 'starter-vault',
    name: 'Elite Vault',
    tier: 1,
    count: 29,
    price: 5999,
    tag: 'Top-tier picks',
    tint: ['#0a2f5c', '#03101f'],
    accent: '#38bdf8',
    blurb: '29 Tier 1 games — the trending blockbusters and AAA hits — for one flat price.',
    features: ['29 Tier 1 Steam keys', 'Blockbusters & AAA titles', 'Priority delivery', 'Steam-activatable keys'],
  },
  {
    id: 'pro-vault',
    name: 'Pro Vault',
    tier: 2,
    count: 49,
    price: 4999,
    tag: 'Mid-tier picks',
    tint: ['#0b3b78', '#04142c'],
    accent: '#3aa6ff',
    highlight: true,
    blurb: '49 Tier 2 games — popular, well-reviewed favourites — for one flat price.',
    features: ['49 Tier 2 Steam keys', 'Popular favourites', 'Priority delivery', 'Steam-activatable keys'],
  },
  {
    id: 'ultimate-vault',
    name: 'Mega Vault',
    tier: 3,
    count: 99,
    price: 3999,
    tag: 'Value picks',
    tint: ['#0d2749', '#020712'],
    accent: '#7cc6ff',
    blurb: '99 Tier 3 games — indies, classics and hidden gems — for one flat price.',
    features: ['99 Tier 3 Steam keys', 'Indies, classics & gems', 'Delivered within 24h', 'Steam-activatable keys'],
  },
];

export function findBundle(id) {
  return BUNDLES.find((b) => b.id === id);
}

export function perGame(bundle) {
  return Math.round(bundle.price / bundle.count);
}
