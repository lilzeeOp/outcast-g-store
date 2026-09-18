export default function SkeletonCard() {
  return (
    <div className="product-card skeleton-card" aria-hidden="true">
      <div className="skeleton-card__media">
        <div className="boot-bars">
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} style={{ animationDelay: `${i * 0.09}s` }} />
          ))}
        </div>
      </div>
      <div className="product-card__info">
        <div className="skeleton-line shimmer" style={{ width: '90%' }} />
        <div className="skeleton-line shimmer" style={{ width: '60%' }} />
        <div className="skeleton-line shimmer" style={{ width: '40%', height: 20 }} />
      </div>
    </div>
  );
}
