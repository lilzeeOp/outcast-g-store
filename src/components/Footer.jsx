import { Link } from 'react-router-dom';
import { telegramLink, whatsappLink } from '../lib/contact';

const COLUMNS = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/about-us' },
      { label: 'FAQ', to: '/faq' },
      { label: 'Legal', to: '/legal' },
    ],
  },
  {
    title: 'Shop',
    links: [
      { label: 'Bundle Packs', to: '/bundles' },
      { label: 'Deals', to: '/category/deals' },
    ],
  },
  {
    title: 'Platforms',
    links: [
      { label: 'PC Games', to: '/category/pc' },
      { label: 'Consoles & Memberships', to: '/category/consoles' },
      { label: 'Gift Cards', to: '/category/gift-cards' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="site-footer neu-grain">
      <div className="container footer-top">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="logo">
              <img className="logo__mark" src="/brand/logo.png" alt="" width="40" height="40" />
              <span className="logo__name">Outcast G Store</span>
            </Link>
            <p>
              Outcast G Store is your #1 digital game store — genuine game keys, memberships,
              gift cards and top-ups, with instant delivery and unbeatable value.
            </p>
            <div className="trust-badges-row">
              <span className="trust-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M20 6 9 17l-5-5" /></svg>
                Secure Checkout
              </span>
              <span className="trust-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M20 6 9 17l-5-5" /></svg>
                Buyer Protection
              </span>
              <span className="trust-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M20 6 9 17l-5-5" /></svg>
                Verified Keys
              </span>
            </div>
            <div className="footer-social">
              <a href={telegramLink('Hi! I have a question about Outcast G Store.')} target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21.9 3.5 2.6 11.2c-1.3.5-1.3 1.2-.2 1.6l4.9 1.5 1.9 5.8c.2.6.4.9.9.9.4 0 .6-.2.9-.5l2.2-2.1 4.6 3.4c.8.5 1.4.2 1.6-.8l3-14c.3-1.3-.4-1.9-1.5-1.5ZM8.4 13.6l9.5-6c.5-.3.9-.1.6.2l-8 7.3-.3 3.3-1.5-4Z" />
                </svg>
              </a>
              <a href={whatsappLink('Hi! I have a question about Outcast G Store.')} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20Zm4.4-6c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.7.8-.8.9-.1.2-.3.2-.5.1-1.5-.7-2.5-1.3-3.5-3-.3-.5.3-.5.8-1.6.1-.2 0-.4 0-.5-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.2-1 1-1 2.4s1 2.8 1.1 3c.1.2 2 3 4.8 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.2-1.2 0-.1-.2-.2-.4-.3Z" />
                </svg>
              </a>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div className="footer-col" key={col.title}>
              <h6>{col.title}</h6>
              <ul>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="footer-col">
            <h6>Support</h6>
            <ul>
              <li>
                <Link to="/faq">Help Center</Link>
              </li>
              <li>
                <a href={telegramLink('Hi! I need help with an order.')} target="_blank" rel="noopener noreferrer">Contact on Telegram</a>
              </li>
              <li>
                <a href={whatsappLink('Hi! I need help with an order.')} target="_blank" rel="noopener noreferrer">Contact on WhatsApp</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <small>© {new Date().getFullYear()} Outcast G Store. All rights reserved. College project — a demo storefront, not a real business.</small>
        <div className="payment-icons">
          <span>VISA</span>
          <span>MC</span>
          <span>PP</span>
          <span>Pay</span>
        </div>
      </div>
    </footer>
  );
}
