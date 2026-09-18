import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PlatformIcon from './PlatformIcon';
import OSIcon from './OSIcon';
import ContactModal from './ContactModal';
import { discountPct, formatINR, rating, reviewCount, stockLeft } from '../data/products';
import useDealCountdown from '../hooks/useDealCountdown';

export default function ProductCard({ product }) {
  const off = discountPct(product);
  const stock = stockLeft(product);
  const countdown = useDealCountdown(product.id);
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <motion.article
      className="product-card"
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
    >
      <Link
        to={`/product/${product.id}`}
        className="product-card__media"
        style={{ '--cover-bg': `linear-gradient(150deg, ${product.cover[0]}, ${product.cover[1]})` }}
        aria-label={product.name}
      >
        {product.image && <img className="product-card__cover-img" src={product.image} alt="" loading="lazy" />}
        <span className="product-card__scrim" aria-hidden="true" />
        <span className="platform-chip">
          <PlatformIcon platform={product.platform} />
        </span>
        {off > 0 && <span className="badge-off badge-ribbon">{off}% Off</span>}
        <span className="product-card__title-plate">{product.tag}</span>
      </Link>
      <div className="product-card__info">
        <Link to={`/product/${product.id}`} className="product-card__name">
          {product.name}
        </Link>
        <div className="product-card__rating">
          <span className="stars" aria-hidden="true">
            {'★'.repeat(Math.round(rating(product))) + '☆'.repeat(5 - Math.round(rating(product)))}
          </span>
          <span className="product-card__rating-count">
            {rating(product)} ({reviewCount(product)})
          </span>
        </div>
        {off > 0 && (
          <div className="product-card__deal">
            <span className="price-was">{formatINR(product.was)}</span>
            <span className="badge-off badge-off--inline">{off}% Off</span>
          </div>
        )}
        <div className="product-card__prices">
          <span className="price-now">{formatINR(product.now)}</span>
          {product.os && product.os.length > 0 && (
            <span className="os-icons" aria-label={`Runs on ${product.os.join(', ')}`}>
              {product.os.map((os) => (
                <OSIcon os={os} key={os} />
              ))}
            </span>
          )}
        </div>
        <span className={`stock-note ${stock <= 5 ? 'stock-note--low' : ''}`}>
          {stock <= 5 ? `Only ${stock} left` : 'In stock'}
        </span>
        {off > 0 && countdown && <span className="deal-countdown">Deal ends in {countdown}</span>}
        <motion.button
          className="product-card__cta"
          whileTap={{ scale: 0.96 }}
          onClick={() => setContactOpen(true)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 11.5a8.4 8.4 0 0 1-8.9 8.4 8.6 8.6 0 0 1-3-.6L3 21l1.8-5.4A8.4 8.4 0 1 1 21 11.5Z" />
          </svg>
          Buy Now
        </motion.button>
      </div>

      <ContactModal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
        title={`Buy ${product.name}`}
        message={`Hi! I'd like to buy ${product.name} for ${formatINR(product.now)}.`}
      />
    </motion.article>
  );
}
