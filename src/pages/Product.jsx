import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Scroller from '../components/Scroller';
import PlatformIcon from '../components/PlatformIcon';
import OSIcon from '../components/OSIcon';
import RecentlyViewedRail from '../components/RecentlyViewedRail';
import ContactModal from '../components/ContactModal';
import { discountPct, findProduct, formatINR, rating, reviewCount, PRODUCTS, TIERS } from '../data/products';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { pairMessage, productMessage } from '../lib/contact';
import { useCatalog } from '../data/catalog';

const FEATURES = [
  'Instant email delivery, 24/7',
  '100% genuine activation key',
  'Direct contact with the seller',
  'Free returns on unactivated keys',
];

export default function Product() {
  const { id } = useParams();
  const { ready: catalogReady } = useCatalog();
  const product = findProduct(id);
  const { record } = useRecentlyViewed();
  const [contact, setContact] = useState(null);

  useDocumentTitle(product ? product.name : 'Product not found');

  useEffect(() => {
    if (product) record(product.id);
  }, [product, record]);

  const bundleItem = useMemo(() => {
    if (!product) return null;
    return PRODUCTS.find((p) => p.category === product.category && p.id !== product.id);
  }, [product]);

  if (!product && !catalogReady) {
    return (
      <div className="container" style={{ paddingBlock: 80 }}>
        <div className="boot-bars" style={{ margin: '0 auto' }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} style={{ animationDelay: `${i * 0.09}s` }} />
          ))}
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container empty-state">
        Product not found. <Link to="/">Back to home</Link>
      </div>
    );
  }

  const off = discountPct(product);
  const stars = rating(product);
  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 5);
  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    offers: {
      '@type': 'Offer',
      price: Math.round(product.now * 83),
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
    ...(stars
      ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: stars, reviewCount: reviewCount(product) } }
      : {}),
  };

  return (
    <div className="container">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="breadcrumb">
        <Link to="/">Home</Link> <span>/</span>{' '}
        <Link to={`/category/${product.category}`}>{product.category}</Link> <span>/</span>{' '}
        <span>{product.name}</span>
      </div>

      <div className="pdp">
        <div
          className="pdp__media"
          style={{ '--cover-bg': `linear-gradient(150deg, ${product.cover[0]}, ${product.cover[1]})` }}
        >
          {product.image && <img className="pdp__cover-img" src={product.image} alt={product.name} loading="lazy" />}
          <span className="pdp__scrim" aria-hidden="true" />
          <div className="pdp__badge">
            {off > 0 && <span className="badge-off" style={{ position: 'static' }}>{off}% Off</span>}
          </div>
          {!product.image && <h2>{product.name}</h2>}
        </div>

        <div>
          <h1>{product.name}</h1>
          <div className="pdp__meta">
            <PlatformIcon platform={product.platform} width="18" height="18" />
            <strong>{product.platform[0].toUpperCase() + product.platform.slice(1)}</strong>
            <span>·</span>
            <span>Instant Delivery</span>
            {stars && (
              <>
                <span>·</span>
                <span className="trust-stars" style={{ color: 'var(--gold)' }}>
                  {'★'.repeat(Math.round(stars))}
                  {'☆'.repeat(5 - Math.round(stars))}
                </span>
                <span style={{ color: 'var(--ink-faint)', fontSize: 12.5 }}>
                  {stars} ({reviewCount(product).toLocaleString('en-IN')} Steam reviews)
                </span>
              </>
            )}
            {product.os && product.os.length > 0 && (
              <>
                <span>·</span>
                <span className="os-icons" aria-label={`Runs on ${product.os.join(', ')}`}>
                  {product.os.map((os) => (
                    <OSIcon os={os} key={os} />
                  ))}
                </span>
              </>
            )}
          </div>

          <div className="pdp__price-box">
            <div className="pdp__price-row">
              {off > 0 && <span className="price-was">{formatINR(product.was)}</span>}
              <span className="price-now">{formatINR(product.now)}</span>
              {product.tier && <span className="tier-pill">Tier {product.tier} · {TIERS[product.tier].name}</span>}
            </div>
            {off > 0 && <div className="pdp__save">You save {formatINR(product.was - product.now)} ({off}%)</div>}
            <span className="stock-note">In stock — ready to deliver</span>
            <div className="pdp__actions" style={{ marginTop: 14 }}>
              <button
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={() =>
                  setContact({
                    title: `Buy ${product.name}`,
                    message: productMessage(product),
                  })
                }
              >
                Buy Now — Contact Seller
              </button>
            </div>
          </div>

          {bundleItem && (
            <div className="bundle-box">
              <h4>Frequently Bought Together</h4>
              <div className="bundle-box__items">
                <div
                  className="bundle-box__thumb"
                  style={
                    product.image
                      ? { backgroundImage: `url(${product.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                      : { background: `linear-gradient(150deg, ${product.cover[0]}, ${product.cover[1]})` }
                  }
                />
                <span className="bundle-box__plus">+</span>
                <div
                  className="bundle-box__thumb"
                  style={
                    bundleItem.image
                      ? { backgroundImage: `url(${bundleItem.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                      : { background: `linear-gradient(150deg, ${bundleItem.cover[0]}, ${bundleItem.cover[1]})` }
                  }
                />
                <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{bundleItem.name}</span>
              </div>
              <div className="bundle-box__foot">
                <span className="bundle-box__total">
                  Total: <strong>{formatINR(product.now + bundleItem.now)}</strong>
                </span>
                <button
                  className="btn btn-dark btn-sm"
                  onClick={() =>
                    setContact({
                      title: 'Buy both games',
                      message: pairMessage(product, bundleItem),
                    })
                  }
                >
                  Ask About Both
                </button>
              </div>
            </div>
          )}

          <div className="pdp__features">
            {FEATURES.map((f) => (
              <div className="pdp__feature" key={f}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                {f}
              </div>
            ))}
          </div>

          <div className="pdp__desc">
            <h3>About this product</h3>
            <p>
              Get {product.name} delivered straight to your inbox in minutes. This listing is a{' '}
              {product.platform[0].toUpperCase() + product.platform.slice(1)} digital key, redeemable worldwide
              unless stated otherwise. Message us on Telegram to confirm availability and complete
              your purchase.
            </p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="section" style={{ paddingTop: 0 }}>
          <div className="section__head">
            <div>
              <span className="section__eyebrow">You Might Also Like</span>
              <h2>More in {product.category}</h2>
            </div>
          </div>
          <Scroller>
            {related.map((p) => (
              <ProductCard product={p} key={p.id} />
            ))}
          </Scroller>
        </div>
      )}

      <RecentlyViewedRail excludeId={product.id} />

      <ContactModal
        isOpen={!!contact}
        onClose={() => setContact(null)}
        title={contact?.title}
        message={contact?.message}
      />
    </div>
  );
}
