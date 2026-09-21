import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatINR } from '../data/products';
import { loadCatalog, searchProducts, useCatalog } from '../data/catalog';
import MobileNav from './MobileNav';

const NAV = [
  { label: 'Home', to: '/', items: [] },
  {
    label: 'PC',
    to: '/category/pc',
    items: [
      { label: 'All PC Games', to: '/category/pc' },
      { label: 'Top Sellers', to: '/category/pc?sort=popular' },
      { label: 'Biggest Discounts', to: '/category/pc?sort=discount' },
    ],
  },
  {
    label: 'Consoles',
    to: '/category/consoles',
    items: [
      { label: 'PlayStation', to: '/category/consoles' },
      { label: 'Xbox', to: '/category/consoles' },
      { label: 'Nintendo', to: '/category/consoles' },
      { label: 'Memberships', to: '/category/consoles' },
    ],
  },
  { label: 'Bundle Packs', to: '/bundles', className: 'main-nav__item--deals', items: [] },
  { label: 'Gift Cards', to: '/category/gift-cards', items: [] },
  { label: 'Deals', to: '/category/deals', items: [] },
  { label: 'Help Center', to: '/faq', items: [] },
  { label: 'About Us', to: '/about-us', items: [] },
];

export default function Header() {
  const [query, setQuery] = useState('');
  const [resultsOpen, setResultsOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const { items: catalog } = useCatalog();

  // Recompute when the catalogue arrives so results include the full list.
  const matches = useMemo(() => searchProducts(query, 8), [query, catalog]);

  useEffect(() => {
    function onClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) setResultsOpen(false);
    }
    function onKey(e) {
      if (e.key === 'Escape') {
        setResultsOpen(false);
        setMobileSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  // Close the mobile search panel on navigation.
  useEffect(() => {
    setMobileSearchOpen(false);
    setResultsOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (mobileSearchOpen) inputRef.current?.focus();
  }, [mobileSearchOpen]);

  function onSearch(e) {
    e.preventDefault();
    if (query.trim()) {
      setResultsOpen(false);
      setMobileSearchOpen(false);
      navigate('/category/pc?q=' + encodeURIComponent(query.trim()));
    }
  }

  function closeAll() {
    setResultsOpen(false);
    setMobileSearchOpen(false);
    setQuery('');
  }

  return (
    <>
      <header className="site-header neu-grain">
        <div className="container header-row">
          <button className="hamburger neu-tap" onClick={() => setMobileNavOpen(true)} aria-label="Open menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>

          <Link to="/" className="logo">
            <img className="logo__mark" src="/brand/logo.png" alt="" width="40" height="40" />
            <span className="logo__name">Outcast G Store</span>
          </Link>

          <button
            type="button"
            className="search-toggle neu-tap"
            aria-label={mobileSearchOpen ? 'Close search' : 'Open search'}
            aria-expanded={mobileSearchOpen}
            onClick={() => {
              loadCatalog();
              setMobileSearchOpen((o) => !o);
            }}
          >
            {mobileSearchOpen ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
            )}
          </button>

          <form className={`search-form ${mobileSearchOpen ? 'is-open' : ''}`} onSubmit={onSearch} ref={searchRef}>
            <input
              ref={inputRef}
              type="search"
              placeholder="Search thousands of games..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setResultsOpen(true);
              }}
              onFocus={() => {
                loadCatalog();
                setResultsOpen(true);
              }}
              aria-label="Search entire store here"
            />
            <button type="submit" aria-label="Search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>
            <button type="button" className="search-close" aria-label="Close search" onClick={closeAll}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
            </button>

            <AnimatePresence>
              {resultsOpen && query.trim() && (
                <motion.div
                  className="search-results"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                >
                  {matches.length === 0 ? (
                    <div className="search-empty">No games match “{query}”.</div>
                  ) : (
                    matches.map((p) => (
                      <Link to={`/product/${p.id}`} key={p.id} onClick={closeAll}>
                        <span
                          className="search-results__thumb"
                          style={
                            p.image
                              ? { backgroundImage: `url(${p.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                              : { background: `linear-gradient(150deg, ${p.cover[0]}, ${p.cover[1]})` }
                          }
                        />
                        <span className="search-results__name">{p.name}</span>
                        <span className="search-results__price">{formatINR(p.now)}</span>
                      </Link>
                    ))
                  )}
                  <Link to={`/category/pc?q=${encodeURIComponent(query.trim())}`} className="search-results__viewall" onClick={closeAll}>
                    View all results for “{query}”
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          <ul className="main-nav__list">
            {NAV.map((item) => (
              <li className={`main-nav__item ${item.className || ''}`} key={item.label}>
                <Link className="main-nav__link" to={item.to}>
                  {item.label}
                  {item.items.length > 0 && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  )}
                </Link>
                {item.items.length > 0 && (
                  <div className="mega">
                    {item.items.map((sub) => (
                      <Link to={sub.to} key={sub.label}>
                        {sub.label}
                      </Link>
                    ))}
                    <Link to={item.to} className="mega__view-all">
                      View All →
                    </Link>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </header>

      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} nav={NAV} />
    </>
  );
}
