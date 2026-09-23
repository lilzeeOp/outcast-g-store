import { useState } from 'react';

function inr(n) {
  return '₹' + n.toLocaleString('en-IN');
}

// "Your Vault" tray: sticky sidebar on desktop, bottom bar + slide-up sheet
// on phones. Shows progress toward the tier size, the picks, and actions.
export default function VaultTray({ bundle, picks, onRemove, onClear, onFill, onCheckout }) {
  const [open, setOpen] = useState(false);
  const count = picks.length;
  const max = bundle.count;
  const pct = Math.min(100, Math.round((count / max) * 100));
  const remaining = max - count;

  const body = (
    <>
      <div className="vault-tray__head">
        <div>
          <span className="vault-tray__eyebrow">{bundle.name}</span>
          <strong className="vault-tray__count">
            {count} <small>/ {max} games picked</small>
          </strong>
        </div>
        <span className="vault-tray__price">{inr(bundle.price)}</span>
      </div>
      <div className="vault-tray__bar" role="progressbar" aria-valuenow={count} aria-valuemin={0} aria-valuemax={max}>
        <span style={{ width: `${pct}%` }} />
      </div>
      {count === 0 ? (
        <p className="vault-tray__empty">Add games from the list, or tap "Fill remaining" to start from our top sellers. All {max} slots must be filled to order.</p>
      ) : (
        <ul className="vault-tray__list">
          {picks.map((p, i) => (
            <li key={p.id}>
              <span className="vault-tray__num">{i + 1}</span>
              <span className="vault-tray__thumb" style={{ backgroundImage: `url(${p.image})` }} />
              <span className="vault-tray__name">{p.name.replace(/ PC$/, '')}</span>
              <button type="button" className="vault-tray__remove" aria-label={`Remove ${p.name}`} onClick={() => onRemove(p.id)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="vault-tray__actions">
        {remaining > 0 && (
          <button type="button" className="btn btn-outline-dark btn-sm" onClick={onFill}>
            Fill remaining {remaining} with top sellers
          </button>
        )}
        {count > 0 && (
          <button type="button" className="vault-tray__clear" onClick={onClear}>
            Clear all
          </button>
        )}
      </div>
      <button type="button" className="btn btn-primary vault-tray__checkout" disabled={remaining > 0} onClick={onCheckout}>
        {remaining > 0 ? `Pick ${remaining} more to continue` : `Continue with ${count} games`}
      </button>
      <p className="vault-tray__note">
        {remaining > 0
          ? `Your vault needs all ${max} games before you can order. Use "Fill remaining" to top it up with top sellers.`
          : `Flat price for the ${bundle.name}. Keys delivered over Telegram.`}
      </p>
    </>
  );

  return (
    <>
      <aside className="vault-tray">{body}</aside>

      <div className={`vault-bar ${open ? 'is-open' : ''}`}>
        <button type="button" className="vault-bar__summary" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          <span className="vault-bar__count">
            {count}/{max}
          </span>
          <span className="vault-bar__text">
            <strong>{bundle.name}</strong>
            <small>{open ? 'Hide picks' : 'View picks'} · {inr(bundle.price)}</small>
          </span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="vault-bar__chev"><path d="m6 15 6-6 6 6" /></svg>
        </button>
        <button type="button" className="btn btn-primary btn-sm" disabled={remaining > 0} onClick={onCheckout}>
          Continue
        </button>
      </div>
      {open && (
        <div className="vault-sheet" role="dialog" aria-label="Your vault picks">
          <div className="vault-sheet__inner">{body}</div>
        </div>
      )}
    </>
  );
}
