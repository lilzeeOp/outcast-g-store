import ProductCard from './ProductCard';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import { findProduct } from '../data/products';

export default function RecentlyViewedRail({ excludeId }) {
  const { ids } = useRecentlyViewed();
  const items = ids.filter((id) => id !== excludeId).map(findProduct).filter(Boolean);

  if (items.length === 0) return null;

  return (
    <div className="section">
      <div className="container">
        <div className="section__head">
          <div>
            <span className="section__eyebrow">Pick Up Where You Left Off</span>
            <h2>Recently Viewed</h2>
          </div>
        </div>
        <div className="product-scroller">
          {items.map((p) => (
            <ProductCard product={p} key={p.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
