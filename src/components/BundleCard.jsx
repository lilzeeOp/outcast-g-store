import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ContactModal from './ContactModal';

function inr(n) {
  return '₹' + n.toLocaleString('en-IN');
}

export default function BundleCard({ bundle }) {
  const [contactOpen, setContactOpen] = useState(false);
  const off = Math.round((1 - bundle.price / bundle.was) * 100);

  return (
    <motion.article
      className={`bundle-card ${bundle.highlight ? 'bundle-card--highlight' : ''}`}
      style={{ '--bundle-accent': bundle.accent, '--bundle-bg': `linear-gradient(150deg, ${bundle.tint[0]}, ${bundle.tint[1]})` }}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
    >
      {bundle.highlight && <span className="bundle-card__pin">Most Popular</span>}
      <span className="bundle-card__tag">{bundle.tag}</span>
      <div className="bundle-card__count">
        {bundle.count}
        <small>+ games</small>
      </div>
      <h3>{bundle.name}</h3>
      <p>{bundle.blurb}</p>
      <ul className="bundle-card__features">
        {bundle.features.map((f) => (
          <li key={f}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="M20 6 9 17l-5-5" /></svg>
            {f}
          </li>
        ))}
      </ul>
      <div className="bundle-card__price">
        <span className="price-was">{inr(bundle.was)}</span>
        <span className="price-now">{inr(bundle.price)}</span>
        {off > 0 && <span className="badge-off">{off}% Off</span>}
      </div>
      <Link to={`/bundles/build/${bundle.id}`} className="btn btn-primary" style={{ width: '100%' }}>
        Choose Your Games
      </Link>
      <button type="button" className="bundle-card__alt" onClick={() => setContactOpen(true)}>
        Or let us pick — just message us
      </button>

      <ContactModal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
        title={`Buy the ${bundle.name}`}
        message={`Hi! I'd like to buy the ${bundle.name} (${bundle.count}+ games) for ${inr(bundle.price)}.`}
        tg={`v_${bundle.id}_${bundle.count}`}
      />
    </motion.article>
  );
}
