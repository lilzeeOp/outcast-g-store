import { useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Scroller from '../components/Scroller';
import PlatformIcon from '../components/PlatformIcon';
import BundleHero from '../components/BundleHero';
import SpotlightHero from '../components/SpotlightHero';
import RecentlyViewedRail from '../components/RecentlyViewedRail';
import { CATEGORIES, PRODUCTS, rating } from '../data/products';
import useDocumentTitle from '../hooks/useDocumentTitle';

const CAT_ICONS = {
  pc: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="4" width="18" height="12" rx="1.5" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  ),
  consoles: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M7 8h10l2.5 7a2.3 2.3 0 0 1-4.2 1.8L14 15h-4l-1.3 1.8A2.3 2.3 0 0 1 4.5 15Z" />
      <path d="M8.5 11v2.5M7.25 12.25h2.5M16 11.2h.01M18 13h.01" />
    </svg>
  ),
  'gift-cards': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="8" width="18" height="12" rx="1.5" />
      <path d="M3 12h18M12 8v12M8 8a2.5 2.5 0 0 1 0-5c1.5 0 4 2 4 5M16 8a2.5 2.5 0 0 0 0-5c-1.5 0-4 2-4 5" />
    </svg>
  ),
  deals: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="m12 2 2.5 5.5L20 9l-4 4 1 6-5-2.7L7 19l1-6-4-4 5.5-1.5Z" />
    </svg>
  ),
};

const TICKER_PLATFORMS = ['steam', 'playstation', 'xbox', 'nintendo'];

function PlatformTicker() {
  const doubled = [...TICKER_PLATFORMS, ...TICKER_PLATFORMS, ...TICKER_PLATFORMS];
  return (
    <div className="platform-ticker">
      <div className="platform-ticker__track">
        {doubled.map((p, i) => (
          <span className="platform-ticker__item" key={p + i}>
            <PlatformIcon platform={p} />
            {p === 'steam' ? 'Steam Games' : p === 'playstation' ? 'PlayStation' : p === 'xbox' ? 'Xbox' : 'Nintendo Switch'}
          </span>
        ))}
      </div>
    </div>
  );
}

function CategoryStrip() {
  return (
    <div className="section" style={{ paddingBottom: 8 }}>
      <div className="container cat-strip">
        {CATEGORIES.map((c) => (
          <Link
            to={`/category/${c.key}`}
            className="cat-card"
            key={c.key}
            style={{ '--cat-color': c.color, '--cat-tint': c.tint }}
          >
            <span className="cat-card__icon">{CAT_ICONS[c.key]}</span>
            <span>{c.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function ProductRow({ eyebrow, title, viewAllTo, items }) {
  return (
    <div className="section">
      <div className="container">
        <div className="section__head">
          <div>
            <span className="section__eyebrow">{eyebrow}</span>
            <h2>{title}</h2>
          </div>
          <Link to={viewAllTo} className="section__link">
            View All
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="m9 6 6 6-6 6" />
            </svg>
          </Link>
        </div>
        <Scroller>
          {items.map((p) => (
            <ProductCard product={p} key={p.id} />
          ))}
        </Scroller>
      </div>
    </div>
  );
}

function TrustBar() {
  const rated = PRODUCTS.map(rating).filter(Boolean);
  const avgRating = (rated.reduce((a, b) => a + b, 0) / rated.length).toFixed(1);
  const items = [
    {
      title: 'Instant Delivery',
      desc: 'Games delivered in minutes',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M13 2 3 14h8l-1 8 10-12h-8l1-8Z" />
        </svg>
      ),
    },
    {
      title: 'Verified Reviews',
      desc: (
        <>
          <span className="trust-stars">★★★★★</span> {avgRating} average on Steam
        </>
      ),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="m12 2 2.9 6 6.6.6-5 4.4 1.5 6.5L12 16l-5.9 3.5L7.6 13l-5-4.4 6.6-.6Z" />
        </svg>
      ),
    },
    {
      title: `${PRODUCTS.length}+ Games`,
      desc: 'A growing digital catalogue',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M3 9h18" />
        </svg>
      ),
    },
    {
      title: 'Direct Contact',
      desc: 'Buy over Telegram — WhatsApp coming soon',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M21 11.5a8.4 8.4 0 0 1-8.9 8.4 8.6 8.6 0 0 1-3-.6L3 21l1.8-5.4A8.4 8.4 0 1 1 21 11.5Z" />
        </svg>
      ),
    },
  ];
  return (
    <div className="trust-bar">
      <div className="container">
        {items.map((it) => (
          <div className="trust-item" key={it.title}>
            <span className="trust-item__icon">{it.icon}</span>
            <div className="trust-item__text">
              <strong>{it.title}</strong>
              <span className="trust-item__desc">{it.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Newsletter() {
  const [done, setDone] = useState(false);
  return (
    <div className="section">
      <div className="container">
        <div className="newsletter">
          <div>
            <h3>Never miss a deal</h3>
            <p>Get the best PC, PlayStation, Xbox &amp; Nintendo offers straight to your inbox.</p>
            {done && <p className="newsletter__ok" role="status">You're in — deals land in your inbox soon.</p>}
          </div>
          <form
            className="newsletter-form"
            onSubmit={(e) => {
              e.preventDefault();
              e.target.reset();
              setDone(true);
            }}
          >
            <input type="email" required placeholder="you@example.com" aria-label="Email address" />
            <button className="btn btn-primary" type="submit">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  useDocumentTitle(null);
  // Genuinely-current picks (trendingNow, sourced fresh from Steam's live
  // charts) lead the row, backfilled with the static demo tags so the row
  // never looks sparse if fewer live picks are flagged.
  const bestsellers = [
    ...PRODUCTS.filter((p) => p.trendingNow),
    ...PRODUCTS.filter((p) => !p.trendingNow && ['Bestseller', 'Trending', 'Award Winner'].includes(p.tag)),
  ];
  const newReleases = PRODUCTS.filter((p) => ['New', 'New Release', 'Pre-Order', 'Deluxe'].includes(p.tag));
  const deals = [...PRODUCTS].sort((a, b) => b.was - b.now - (a.was - a.now)).slice(0, 10);

  return (
    <>
      <div className="section hero">
        <div className="container">
          <SpotlightHero />
        </div>
      </div>
      <PlatformTicker />
      <CategoryStrip />
      <div className="section">
        <div className="container">
          <BundleHero />
        </div>
      </div>
      <ProductRow eyebrow="Hot Right Now" title="Trending & Bestsellers" viewAllTo="/category/deals" items={bestsellers} />
      <ProductRow eyebrow="Just Dropped" title="New & Upcoming Releases" viewAllTo="/category/pc" items={newReleases} />
      <div className="section--tint">
        <ProductRow eyebrow="Save Big" title="Today's Best Deals" viewAllTo="/category/deals" items={deals} />
      </div>
      <RecentlyViewedRail />
      <TrustBar />
      <Newsletter />
    </>
  );
}
