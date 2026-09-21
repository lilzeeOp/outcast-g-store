import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BUNDLES } from '../data/bundles';
import ContactModal from './ContactModal';
import { bundleMessage } from '../lib/contact';

function inr(n) {
  return '₹' + n.toLocaleString('en-IN');
}

// The nine AAA titles from the store's hero artwork, shown as a wall of their
// real Steam portrait covers (public/brand/hero/*.jpg, 360x540 each).
const HERO_COVERS = [
  { id: 'rdr2', name: 'Red Dead Redemption 2' },
  { id: 'cyberpunk', name: 'Cyberpunk 2077' },
  { id: 'elden-ring', name: 'ELDEN RING' },
  { id: 'bg3', name: "Baldur's Gate 3" },
  { id: 'gow-ragnarok', name: 'God of War Ragnarök' },
  { id: 'spiderman-2', name: "Marvel's Spider-Man 2" },
  { id: 'wukong', name: 'Black Myth: Wukong' },
  { id: 'ghost-of-tsushima', name: "Ghost of Tsushima DIRECTOR'S CUT" },
  { id: 'borderlands-3', name: 'Borderlands 3' },
];

export default function BundleHero() {
  const [tierIndex, setTierIndex] = useState(1);
  const [contactOpen, setContactOpen] = useState(false);
  const bundle = BUNDLES[tierIndex];
  const off = Math.round((1 - bundle.price / bundle.was) * 100);

  return (
    <div className="bundle-hero neu-grain">
      <div className="bundle-hero__content">
        <span className="hero-console__tag">Bundle Packs</span>
        <h1>Your whole library.
          <br />One price.
        </h1>
        <p>Flat-priced vaults of genuine PC keys — pick a tier, message us, get delivered over Telegram or WhatsApp.</p>

        <div className="bundle-hero__tabs" role="tablist" aria-label="Choose a vault tier">
          {BUNDLES.map((b, i) => (
            <button
              key={b.id}
              className={`bundle-hero__tab ${i === tierIndex ? 'is-active' : ''}`}
              onClick={() => setTierIndex(i)}
              role="tab"
              aria-selected={i === tierIndex}
            >
              <span className="bundle-hero__tab-count">{b.count}+</span>
              <span className="bundle-hero__tab-tag">{b.tag}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={bundle.id}
            className="bundle-hero__panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
          >
            <div className="bundle-hero__count">
              {bundle.count}
              <small>+ games</small>
            </div>
            <div className="bundle-hero__panel-body">
              <h2>{bundle.name}</h2>
              <p>{bundle.blurb}</p>
              <div className="bundle-hero__price">
                <span className="price-was">{inr(bundle.was)}</span>
                <span className="price-now">{inr(bundle.price)}</span>
                {off > 0 && <span className="badge-off" style={{ position: 'static' }}>{off}% Off</span>}
              </div>
              <div className="bundle-hero__actions">
                <Link to={`/bundles/build/${bundle.id}`} className="btn btn-primary">
                  Choose Your Games
                </Link>
                <Link to="/bundles" className="btn btn-outline">
                  Compare All Vaults
                </Link>
                <button type="button" className="bundle-hero__alt" onClick={() => setContactOpen(true)}>
                  Or just message us
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="bundle-hero__gallery" aria-hidden="true">
        <div className="bundle-hero__wall">
          {HERO_COVERS.map((c) => (
            <img key={c.id} src={`/brand/hero/${c.id}.jpg`} alt="" width="360" height="540" />
          ))}
        </div>
      </div>

      <ContactModal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
        title={`Buy the ${bundle.name}`}
        message={bundleMessage(bundle)}
      />
    </div>
  );
}
