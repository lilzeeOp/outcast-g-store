import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import { CATEGORIES, PRODUCTS } from '../data/products';
import { useCatalog } from '../data/catalog';
import useDocumentTitle from '../hooks/useDocumentTitle';

const PLATFORM_FILTERS = [
  { key: 'steam', label: 'Steam' },
  { key: 'playstation', label: 'PlayStation' },
  { key: 'xbox', label: 'Xbox' },
  { key: 'nintendo', label: 'Nintendo' },
];
const PAGE_SIZE = 24;

export default function Category() {
  const { key } = useParams();
  const [searchParams] = useSearchParams();
  const q = (searchParams.get('q') || '').toLowerCase();
  const [platformFilter, setPlatformFilter] = useState([]);
  const [sort, setSort] = useState(searchParams.get('sort') || 'popular');
  const { items: catalog, ready: catalogReady } = useCatalog();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const cat = CATEGORIES.find((c) => c.key === key);
  const label = cat ? cat.label : key === 'deals' ? 'Deals' : 'All Games';
  useDocumentTitle(q ? `Search: ${q}` : label);

  const items = useMemo(() => {
    // PC and Deals draw from the full Steam catalogue once it has loaded.
    let list = key === 'pc' || key === 'deals' || q ? [...PRODUCTS, ...catalog] : PRODUCTS;
    if (key && key !== 'deals') list = list.filter((p) => p.category === key);
    if (key === 'deals') list = list.filter((p) => p.was > p.now);
    if (q) list = list.filter((p) => p.name.toLowerCase().includes(q));
    if (platformFilter.length) list = list.filter((p) => platformFilter.includes(p.platform));

    list = [...list];
    if (sort === 'popular') list.sort((a, b) => (a.rank ?? -1) - (b.rank ?? -1));
    if (sort === 'price-asc') list.sort((a, b) => a.now - b.now);
    if (sort === 'price-desc') list.sort((a, b) => b.now - a.now);
    if (sort === 'discount') list.sort((a, b) => (1 - b.now / b.was) - (1 - a.now / a.was));
    return list;
  }, [key, q, platformFilter, sort, catalog]);

  const pageCount = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const pagedItems = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    const s = searchParams.get('sort');
    if (s) setSort(s);
  }, [searchParams]);

  // Reset to page 1 whenever the underlying result set changes.
  useEffect(() => {
    setPage(1);
  }, [key, q, platformFilter, sort]);

  // Brief skeleton flash to simulate an API round-trip when the page/filters change.
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 280);
    return () => clearTimeout(t);
  }, [key, q, platformFilter, sort, page]);

  function togglePlatform(p) {
    setPlatformFilter((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  }

  return (
    <div className="container">
      <div className="breadcrumb">
        <Link to="/">Home</Link> <span>/</span> <span>{label}</span>
      </div>
      <div className="page-head">
        <h1>{q ? `Search results for "${q}"` : label}</h1>
        <p>{items.length} product{items.length === 1 ? '' : 's'} found</p>
      </div>

      <div className="filters-layout">
        <aside>
          <div className="filter-box">
            <h4>Platform</h4>
            {PLATFORM_FILTERS.map((p) => (
              <label className="filter-opt" key={p.key}>
                <input type="checkbox" checked={platformFilter.includes(p.key)} onChange={() => togglePlatform(p.key)} />
                {p.label}
              </label>
            ))}
          </div>
        </aside>

        <div>
          <div className="toolbar">
            <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>Showing {items.length} results</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products">
              <option value="popular">Sort: Most Popular</option>
              <option value="relevance">Sort: Relevance</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="discount">Biggest Discount</option>
            </select>
          </div>

          {items.length === 0 && catalogReady ? (
            <div className="empty-state">No games match these filters yet — try clearing a filter.</div>
          ) : (
            <>
              <div className="grid-4">
                {loading || (!catalogReady && (key === 'pc' || key === 'deals' || q))
                  ? Array.from({ length: pagedItems.length || PAGE_SIZE }, (_, i) => <SkeletonCard key={i} />)
                  : pagedItems.map((p) => <ProductCard product={p} key={p.id} />)}
              </div>

              {pageCount > 1 && (
                <nav className="pagination" aria-label="Pagination">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} aria-label="Previous page">
                    ‹
                  </button>
                  {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      className={n === page ? 'is-active' : ''}
                      onClick={() => setPage(n)}
                      aria-current={n === page ? 'page' : undefined}
                    >
                      {n}
                    </button>
                  ))}
                  <button onClick={() => setPage((p) => Math.min(pageCount, p + 1))} disabled={page === pageCount} aria-label="Next page">
                    ›
                  </button>
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
