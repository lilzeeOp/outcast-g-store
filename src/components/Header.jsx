import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PRODUCTS, formatINR } from '../data/products';
import MobileNav from './MobileNav';

const NAV = [
  { label: 'Home', to: '/', items: [] },
  {
    label: 'PC',
    to: '/category/pc',
    items: [
      { label: 'PC Games', to: '/category/pc' },
      { label: 'Steam Games', to: '/category/pc' },
      { label: 'Time Cards & DLC', to: '/category/pc' },
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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return PRODUCTS.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 5);
  }, [query]);

  useEffect(() => {
    function onClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) setResultsOpen(false);
    }
    function onKey(e) {
      if (e.key === 'Escape') setResultsOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  function onSearch(e) {
    e.preventDefault();
    if (query.trim()) {
      setResultsOpen(false);
      navigate('/category/pc?q=' + encodeURIComponent(query.trim()));
    }
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

          <form className="search-form" onSubmit={onSearch} ref={searchRef}>
            <input
              type="search"
              placeholder="Search by title..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setResultsOpen(true);
              }}
              onFocus={() => setResultsOpen(true)}
              aria-label="Search entire store here"
            />
            <button type="submit" aria-label="Search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
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
                      <Link
                        to={`/product/${p.id}`}
                        key={p.id}
                        onClick={() => {
                          setResultsOpen(false);
                          setQuery('');
                        }}
                      >
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
                  <Link to={`/category/pc?q=${encodeURIComponent(query.trim())}`} className="search-results__viewall" onClick={() => setResultsOpen(false)}>
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
