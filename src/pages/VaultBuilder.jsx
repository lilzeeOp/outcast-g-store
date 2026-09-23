import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { BUNDLES, findBundle, perGame } from '../data/bundles';
import { PRODUCTS, TIERS, findProduct, formatINR } from '../data/products';
import { rankByQuery, useCatalog } from '../data/catalog';
import { decodePicks, encodePicks, useVault } from '../context/VaultContext';
import VaultTray from '../components/VaultTray';
import QuickAdd from '../components/QuickAdd';
import ContactModal from '../components/ContactModal';
import { vaultMessage } from '../lib/contact';
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

  // Only Steam games of this vault's tier can go in it.
  const pool = useMemo(
    () => [...PRODUCTS, ...catalog].filter((p) => p.category === 'pc' && p.platform === 'steam' && p.tier === (bundle ? bundle.tier : 0)),
    [catalog, bundle],
  );

  const list = useMemo(() => {
    const needle = q.trim();
    let out = needle ? rankByQuery(pool, needle) : [...pool];
    if (sort === 'popular' && !needle) out.sort((a, b) => (a.rank ?? -1) - (b.rank ?? -1));
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
  const titles = picks.map((p) => p.name.replace(/ PC$/, ''));
  const message = vaultMessage(bundle, titles, shareUrl, MESSAGE_CAP);
  const copyText = `${bundle.name} — ${picks.length} picks\n${titles.map((t, i) => `${i + 1}. ${t}`).join('\n')}\n\n${shareUrl}`;

  return (
    <div className="container vb">
      <div className="breadcrumb">
        <Link to="/">Home</Link> <span>/</span> <Link to="/bundles">Bundle Packs</Link> <span>/</span> <span>{bundle.name}</span>
      </div>

      <div className="vb__head">
        <div>
          <span className="section__eyebrow">Build your vault</span>
          <h1>Choose your {bundle.count} Tier {bundle.tier} games</h1>
          <p className="vb__lede">
            Pick any <strong>Tier {bundle.tier}</strong> titles ({TIERS[bundle.tier].blurb.toLowerCase()}) for your{' '}
            <strong>{bundle.name}</strong> — a flat {inr(bundle.price)}, about {inr(perGame(bundle))} per game. Fill all {bundle.count}{' '}
            slots by searching above or browsing below, or use “Fill remaining” to top up with the most popular ones.
          </p>
        </div>
        <div className="vb__tiers" role="tablist" aria-label="Switch vault tier">
          {BUNDLES.map((b) => (
            <Link key={b.id} to={`/bundles/build/${b.id}`} className={`vb__tier ${b.id === bundle.id ? 'is-active' : ''}`} role="tab" aria-selected={b.id === bundle.id}>
              <strong>{b.count}</strong>
              <small>Tier {b.tier} · {inr(b.price)}</small>
            </Link>
          ))}
        </div>
      </div>

      <div className="vb__sticky">
        <QuickAdd
          pool={pool}
          picked={picked}
          full={full}
          ready={ready}
          tierLabel={`Tier ${bundle.tier}`}
          onAdd={(id) => add(bundle.id, id, bundle.count)}
          onRemove={(id) => remove(bundle.id, id)}
        />
        <div className="vb__sticky-count" aria-live="polite">
          <strong>{pickIds.length}</strong> / {bundle.count} picked
        </div>
      </div>

      <div className="vb__layout">
        <div className="vb__browse">
          <div className="vb__toolbar">
            <input
              type="search"
              className="vb__search"
              placeholder={ready ? `Browse ${pool.length.toLocaleString('en-IN')} Tier ${bundle.tier} games…` : 'Loading games…'}
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
                      <span className="vb-card__meta">Tier {p.tier} · {formatINR(p.now)} alone</span>
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
