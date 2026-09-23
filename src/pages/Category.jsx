import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import { CATEGORIES, PRODUCTS } from '../data/products';
import { rankByQuery, useCatalog } from '../data/catalog';
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
  const [visible, setVisible] = useState(PAGE_SIZE);

  const cat = CATEGORIES.find((c) => c.key === key);
  const label = cat ? cat.label : key === 'deals' ? 'Deals' : 'All Games';
  useDocumentTitle(q ? `Search: ${q}` : label);

  const items = useMemo(() => {
    // PC and Deals draw from the full Steam catalogue once it has loaded.
    let list = key === 'pc' || key === 'deals' || q ? [...PRODUCTS, ...catalog] : PRODUCTS;
    if (key && key !== 'deals') list = list.filter((p) => p.category === key);
    // Deals = the 96 biggest rupee savings across the whole catalogue.
    if (key === 'deals') list = [...list].filter((p) => p.was > p.now).sort((a, b) => b.was - b.now - (a.was - a.now)).slice(0, 96);
    if (q) list = rankByQuery(list, q);
    if (platformFilter.length) list = list.filter((p) => platformFilter.includes(p.platform));

    list = [...list];
    if (sort === 'popular' && key !== 'deals' && !q) list.sort((a, b) => (a.rank ?? -1) - (b.rank ?? -1));
    if (sort === 'price-asc') list.sort((a, b) => a.now - b.now);
    if (sort === 'price-desc') list.sort((a, b) => b.now - a.now);
    if (sort === 'discount') list.sort((a, b) => b.was - b.now - (a.was - a.now));
    return list;
  }, [key, q, platformFilter, sort, catalog]);

  const pagedItems = items.slice(0, visible);
  const remaining = Math.max(0, items.length - visible);

  useEffect(() => {
    const s = searchParams.get('sort');
    if (s) setSort(s);
  }, [searchParams]);

  // Reset the visible window whenever the underlying result set changes.
  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [key, q, platformFilter, sort]);


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
        <p>{key === 'deals' ? `Top ${items.length} savings right now — the games where 60% off saves you the most` : `${items.length} product${items.length === 1 ? '' : 's'} found`}</p>
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
              <option value="popular">{key === 'deals' ? 'Sort: Biggest Saving' : 'Sort: Most Popular'}</option>
              <option value="relevance">Sort: Relevance</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="discount">Biggest Saving</option>
            </select>
          </div>

          {items.length === 0 && catalogReady ? (
            <div className="empty-state">No games match these filters yet — try clearing a filter.</div>
          ) : (
            <>
              <div className="grid-4">
                {!catalogReady && (key === 'pc' || key === 'deals' || q)
                  ? Array.from({ length: pagedItems.length || PAGE_SIZE }, (_, i) => <SkeletonCard key={i} />)
                  : pagedItems.map((p) => <ProductCard product={p} key={p.id} />)}
              </div>

              {remaining > 0 && (
                <div className="load-more">
                  <button type="button" className="btn btn-outline-dark" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                    Show {Math.min(PAGE_SIZE, remaining)} more ({remaining.toLocaleString('en-IN')} left)
                  </button>
                  <span className="load-more__meta">
                    Showing {pagedItems.length.toLocaleString('en-IN')} of {items.length.toLocaleString('en-IN')}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
