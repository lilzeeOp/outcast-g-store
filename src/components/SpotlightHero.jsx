import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { SPOTLIGHT } from '../data/spotlight';
import { discountPct, findProduct, formatINR } from '../data/products';
import useDealCountdown from '../hooks/useDealCountdown';

const ROTATE_MS = 8000;

// Spotlight hero — one card in the bundle-hero style: a strip of game cover
// thumbnails across the top (active one outlined), the selected game's key art
// bleeding in from the right, and title / blurb / price / CTAs bottom-left.
export default function SpotlightHero() {
  const slides = SPOTLIGHT.map((s) => ({ ...s, product: findProduct(s.id) })).filter((s) => s.product);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [saved, setSaved] = useState({});
  const stripRef = useRef(null);

  useEffect(() => {
    if (paused) return undefined;
    const t = setTimeout(() => setIndex((i) => (i + 1) % slides.length), ROTATE_MS);
    return () => clearTimeout(t);
  }, [index, paused, slides.length]);

  // Keep the active thumbnail in view and warm the next slide's art.
  useEffect(() => {
    const el = stripRef.current?.children[index];
    el?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
    const next = slides[(index + 1) % slides.length];
    const img = new Image();
    img.src = `/brand/hero/${next.id}-hero.jpg`;
  }, [index, slides]);

  const step = (d) => setIndex((i) => (i + d + slides.length) % slides.length);

  const active = slides[index];
  const p = active.product;
  const off = discountPct(p);
  const countdown = useDealCountdown(p.id);
  const title = p.name.replace(/ PC$/, '');

  return (
    <section
      className="spotlight neu-grain"
      aria-label="Featured games"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <AnimatePresence mode="sync">
        <motion.img
          key={active.id}
          className="spotlight__art"
          src={`/brand/hero/${active.id}-hero.jpg`}
          alt=""
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      </AnimatePresence>
      <div className="spotlight__shade" />

      <div className="spotlight__top">
        <div className="spotlight__strip" ref={stripRef} role="tablist" aria-label="Featured titles">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={s.product.name}
              className={`spotlight__thumb ${i === index ? 'is-active' : ''}`}
              onClick={() => setIndex(i)}
            >
              <img src={`/brand/hero/${s.id}.jpg`} alt="" width="360" height="540" />
            </button>
          ))}
        </div>
        <div className="spotlight__nav">
          <button type="button" className="spotlight__arrow" aria-label="Previous game" onClick={() => step(-1)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 6-6 6 6 6" /></svg>
          </button>
          <button type="button" className="spotlight__arrow" aria-label="Next game" onClick={() => step(1)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 6 6 6-6 6" /></svg>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          className="spotlight__copy"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3 }}
        >
          <div className="spotlight__badges">
            <span className="spotlight__badge spotlight__badge--sale">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 5v5.6l3.5 2.1-.8 1.3L11 13V7h2Z" /></svg>
              Sale {countdown && <b>{countdown}</b>}
            </span>
            <span className="spotlight__badge">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2 2.9 6 6.6.6-5 4.4 1.5 6.5L12 16l-5.9 3.5L7.6 13l-5-4.4 6.6-.6Z" /></svg>
              AAA Title
            </span>
          </div>
          <h1 className="spotlight__title">{title}</h1>
          <p className="spotlight__blurb">{active.blurb}</p>
          <div className="spotlight__price">
            <div className="spotlight__price-top">
              <span className="price-was">{formatINR(p.was)}</span>
              <span className="badge-off badge-off--inline">-{off}%</span>
            </div>
            <span className="price-now">{formatINR(p.now)}</span>
          </div>
          <div className="spotlight__actions">
            <Link to={`/product/${p.id}`} className="btn btn-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.5L21 8H6" /><circle cx="10" cy="20" r="1" /><circle cx="17" cy="20" r="1" /></svg>
              Buy Now
            </Link>
            <Link to={`/product/${p.id}`} className="btn btn-ghost">Details</Link>
            <button
              type="button"
              className={`spotlight__heart ${saved[p.id] ? 'is-on' : ''}`}
              aria-pressed={!!saved[p.id]}
              aria-label={saved[p.id] ? 'Remove from wishlist' : 'Add to wishlist'}
              onClick={() => setSaved((s) => ({ ...s, [p.id]: !s[p.id] }))}
            >
              <svg viewBox="0 0 24 24" fill={saved[p.id] ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><path d="M12 21s-7.5-4.6-9.5-9.3C1.2 8.6 3.3 5 6.8 5c2 0 3.4 1.1 4.2 2.3C11.8 6.1 13.2 5 15.2 5c3.5 0 5.6 3.6 4.3 6.7C19.5 16.4 12 21 12 21Z" /></svg>
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
