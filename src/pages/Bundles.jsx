import { Link } from 'react-router-dom';
import { BUNDLES } from '../data/bundles';
import BundleCard from '../components/BundleCard';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function Bundles() {
  useDocumentTitle('Bundle Packs');
  return (
    <div className="container content-page" style={{ maxWidth: 1100 }}>
      <div className="breadcrumb">
        <Link to="/">Home</Link> <span>/</span> <span>Bundle Packs</span>
      </div>
      <h1>Game Bundle Packs</h1>
      <p className="lede">
        One flat price, a whole vault of keys. Pick a tier, message us to lock it in, and we'll get your
        keys delivered over Telegram or WhatsApp.
      </p>

      <div className="bundle-grid">
        {BUNDLES.map((b) => (
          <BundleCard bundle={b} key={b.id} />
        ))}
      </div>

      <div className="content-block" style={{ marginTop: 40 }}>
        <h2>How it works</h2>
        <p>
          Bundles are curated batches of genuine PC game keys, grouped by tier rather than by title — you're
          paying for library size and value, not picking individual games. Message us on Telegram or WhatsApp
          after choosing a vault and we'll confirm what's currently in stock before you pay.
        </p>
      </div>
    </div>
  );
}
