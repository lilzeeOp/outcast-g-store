import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function MobileNav({ isOpen, onClose, nav }) {
  const [openKey, setOpenKey] = useState(null);

  return (
    <>
      <div className={`mobile-nav-overlay ${isOpen ? 'is-open' : ''}`} onClick={onClose} />
      <nav className={`mobile-nav neu-grain ${isOpen ? 'is-open' : ''}`} aria-hidden={!isOpen}>
        <div className="mobile-nav__head">
          <span className="logo" style={{ fontSize: 16 }}>
            Outcast G Store
          </span>
          <button className="cart-drawer__close" style={{ background: 'rgba(255,255,255,.08)', color: '#fff' }} onClick={onClose} aria-label="Close menu">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
        <div className="mobile-nav__body">
          {nav.map((item) => (
            <div className="mobile-nav__item" key={item.label}>
              {item.items.length > 0 ? (
                <>
                  <button
                    className={`mobile-nav__link ${openKey === item.label ? 'is-open' : ''}`}
                    onClick={() => setOpenKey(openKey === item.label ? null : item.label)}
                    style={{ width: '100%' }}
                  >
                    {item.label}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                  <div className={`mobile-nav__sub ${openKey === item.label ? 'is-open' : ''}`}>
                    {item.items.map((sub) => (
                      <Link to={sub.to} key={sub.label} onClick={onClose}>
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link className="mobile-nav__link" to={item.to} onClick={onClose}>
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      </nav>
    </>
  );
}
