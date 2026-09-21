import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { BUNDLES, findBundle } from '../data/bundles';
import { PRODUCTS, findProduct, formatINR } from '../data/products';
import { useCatalog } from '../data/catalog';
import { decodePicks, encodePicks, useVault } from '../context/VaultContext';
import VaultTray from '../components/VaultTray';
import ContactModal from '../components/ContactModal';
import useDocumentTitle from '../hooks/useDocumentTitle';

const PAGE = 24;
const MESSAGE_CAP = 40; // titles listed inline in the chat message

function inr(n) {
  return '₹' + n.toLocaleString('en-IN');
}

export default function VaultBuilder() {
  const { tier } = useParams();
  const bundle = findBundle(tier);
  const [searchParams, setSearchParams] = useSearchParams();
  const { items: catalog, ready } = useCatalog();
  const { picksFor, setPicks, add, remove, clear } = useVault();
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('popular');
  const [visible, setVisible] = useState(PAGE);
  const [contactOpen, setContactOpen] = useState(false);

  useDocumentTitle(bundle ? `Build your ${bundle.name}` : 'Bundle not found');

  // A shared link (?picks=code) replaces the stored picks for this tier.
  useEffect(() => {
    const code = searchParams.get('picks');
    if (code && bundle) {
      const ids = decodePicks(code);
      if (ids.length) setPicks(bundle.id, ids.slice(0, bundle.count));
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, bundle, setPicks, setSearchParams]);

  // Only Steam PC keys can go in a vault.
  const pool = useMemo(
    () => [...PRODUCTS, ...catalog].filter((p) => p.category === 'pc' && p.platform === 'steam'),
    [catalog],
  );

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let out = needle ? pool.filter((p) => p.name.toLowerCase().includes(needle)) : pool;
    out = [...out];
    if (sort === 'popular') out.sort((a, b) => (a.rank ?? -1) - (b.rank ?? -1));
    if (sort === 'name') out.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'price-asc') out.sort((a, b) => a.now - b.now);
    if (sort === 'price-desc') out.sort((a, b) => b.now - a.now);
    return out;
  }, [pool, q, sort]);

  useEffect(() => {
    setVisible(PAGE);
  }, [q, sort]);

  if (!bundle) {
    return (
      <div className="container empty-state">
        That bundle doesn't exist. <Link to="/bundles">See all vaults</Link>
      </div>
    );
  }

  const pickIds = picksFor(bundle.id);
  const picks = pickIds.map(findProduct).filter(Boolean);
  const picked = new Set(pickIds);
  const full = pickIds.length >= bundle.count;

  function fill() {
    const extra = [];
    for (const p of [...pool].sort((a, b) => (a.rank ?? -1) - (b.rank ?? -1))) {
      if (pickIds.length + extra.length >= bundle.count) break;
      if (!picked.has(p.id)) extra.push(p.id);
    }
    setPicks(bundle.id, [...pickIds, ...extra]);
  }

  const code = encodePicks(pickIds);
  const shareUrl = `${window.location.origin}/bundles/build/${bundle.id}?picks=${code}`;
  const titles = picks.map((p, i) => `${i + 1}. ${p.name.replace(/ PC$/, '')}`);
  const listed = titles.slice(0, MESSAGE_CAP).join('\n');
  const more = titles.length > MESSAGE_CAP ? `\n…and ${titles.length - MESSAGE_CAP} more (full list in the link below)` : '';
  const message = `Hi! I'd like the ${bundle.name} (${bundle.count} games) for ${inr(bundle.price)}.\nMy picks (${picks.length}):\n${listed}${more}\n\nFull list: ${shareUrl}`;
  const copyText = `${bundle.name} — ${picks.length} picks\n${titles.join('\n')}\n\n${shareUrl}`;

  return (
    <div className="container vb">
      <div className="breadcrumb">
        <Link to="/">Home</Link> <span>/</span> <Link to="/bundles">Bundle Packs</Link> <span>/</span> <span>{bundle.name}</span>
      </div>

      <div className="vb__head">
        <div>
          <span className="section__eyebrow">Build your vault</span>
          <h1>Choose your {bundle.count} games</h1>
          <p className="vb__lede">
            Pick any Steam titles you want in your <strong>{bundle.name}</strong> for a flat {inr(bundle.price)}. Fill all {bundle.count} slots
            yourself, or use “Fill remaining” to top up with top sellers.
          </p>
        </div>
        <div className="vb__tiers" role="tablist" aria-label="Switch vault tier">
          {BUNDLES.map((b) => (
            <Link key={b.id} to={`/bundles/build/${b.id}`} className={`vb__tier ${b.id === bundle.id ? 'is-active' : ''}`} role="tab" aria-selected={b.id === bundle.id}>
              <strong>{b.count}+</strong>
              <small>{inr(b.price)}</small>
            </Link>
          ))}
        </div>
      </div>

      <div className="vb__layout">
        <div className="vb__browse">
          <div className="vb__toolbar">
            <input
              type="search"
              className="vb__search"
              placeholder={ready ? `Search ${pool.length.toLocaleString('en-IN')} Steam games…` : 'Loading catalogue…'}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Search games to add"
            />
            <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort games">
              <option value="popular">Most Popular</option>
              <option value="name">A to Z</option>
              <option value="price-asc">List price: Low to High</option>
              <option value="price-desc">List price: High to Low</option>
            </select>
          </div>

          {list.length === 0 && ready ? (
            <div className="empty-state">No games match “{q}”.</div>
          ) : (
            <div className="vb__grid">
              {list.slice(0, visible).map((p) => {
                const on = picked.has(p.id);
                return (
                  <article key={p.id} className={`vb-card ${on ? 'is-picked' : ''}`}>
                    <div className="vb-card__media" style={{ background: `linear-gradient(150deg, ${p.cover[0]}, ${p.cover[1]})` }}>
                      {p.image && <img src={p.image} alt="" loading="lazy" />}
                      {on && <span className="vb-card__check">✓</span>}
                    </div>
                    <div className="vb-card__body">
                      <h3 title={p.name}>{p.name.replace(/ PC$/, '')}</h3>
                      <span className="vb-card__meta">Steam key · list {formatINR(p.was)}</span>
                      <button
                        type="button"
                        className={`btn btn-sm ${on ? 'btn-dark' : 'btn-outline-dark'} vb-card__btn`}
                        disabled={!on && full}
                        onClick={() => (on ? remove(bundle.id, p.id) : add(bundle.id, p.id, bundle.count))}
                      >
                        {on ? 'Added ✓' : full ? 'Vault full' : '+ Add'}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {visible < list.length && (
            <div className="vb__more">
              <button type="button" className="btn btn-outline-dark" onClick={() => setVisible((v) => v + PAGE)}>
                Show more ({(list.length - visible).toLocaleString('en-IN')} left)
              </button>
            </div>
          )}
        </div>

        <VaultTray
          bundle={bundle}
          picks={picks}
          onRemove={(id) => remove(bundle.id, id)}
          onClear={() => clear(bundle.id)}
          onFill={fill}
          onCheckout={() => setContactOpen(true)}
        />
      </div>

      <ContactModal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
        title={`Order your ${bundle.name}`}
        message={message}
        copyText={copyText}
      />
    </div>
  );
}
