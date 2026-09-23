import { useEffect, useMemo, useRef, useState } from 'react';
import { rankByQuery } from '../data/catalog';
import { formatINR } from '../data/products';

const LIMIT = 8;

// Sticky search-to-add box for the vault builder. Type a game, press Enter or
// tap Add, keep typing — no scrolling back to the top of the grid.
export default function QuickAdd({ pool, picked, full, onAdd, onRemove, ready, tierLabel }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(0);
  const [flash, setFlash] = useState(null);
  const boxRef = useRef(null);
  const inputRef = useRef(null);

  const matches = useMemo(() => (q.trim() ? rankByQuery(pool, q).slice(0, LIMIT) : []), [pool, q]);

  useEffect(() => {
    setCursor(0);
  }, [q]);

  useEffect(() => {
    const onDoc = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const toggle = (p) => {
    if (picked.has(p.id)) {
      onRemove(p.id);
      return;
    }
    if (full) return;
    onAdd(p.id);
    setFlash(p.id);
    setTimeout(() => setFlash(null), 900);
    inputRef.current?.focus();
  };

  const onKey = (e) => {
    if (!matches.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursor((c) => (c + 1) % matches.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursor((c) => (c - 1 + matches.length) % matches.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      toggle(matches[cursor]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div className="quick-add" ref={boxRef}>
      <div className="quick-add__field">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
        <input
          ref={inputRef}
          type="search"
          value={q}
          placeholder={ready ? `Type a ${tierLabel} game and press Enter to add…` : 'Loading games…'}
          aria-label="Search games to add to your vault"
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKey}
        />
        {q && (
          <button type="button" className="quick-add__clear" aria-label="Clear search" onClick={() => { setQ(''); inputRef.current?.focus(); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        )}
      </div>

      {open && q.trim() && (
        <ul className="quick-add__list" role="listbox">
          {matches.length === 0 ? (
            <li className="quick-add__empty">No {tierLabel} games match “{q}”. Try another title or check a different vault.</li>
          ) : (
            matches.map((p, i) => {
              const on = picked.has(p.id);
              return (
                <li key={p.id} role="option" aria-selected={i === cursor} className={`quick-add__item ${i === cursor ? 'is-cursor' : ''} ${on ? 'is-on' : ''}`} onMouseEnter={() => setCursor(i)}>
                  <span className="quick-add__thumb" style={{ backgroundImage: `url(${p.image})` }} />
                  <span className="quick-add__name">{p.name.replace(/ PC$/, '')}</span>
                  <span className="quick-add__meta">{formatINR(p.now)} alone</span>
                  <button
                    type="button"
                    className={`btn btn-sm ${on ? 'btn-dark' : 'btn-primary'} quick-add__btn`}
                    disabled={!on && full}
                    onClick={() => toggle(p)}
                  >
                    {on ? (flash === p.id ? 'Added ✓' : 'Remove') : full ? 'Full' : '+ Add'}
                  </button>
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}
