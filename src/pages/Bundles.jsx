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
        One flat price, a whole vault of keys. Pick a tier, choose the games you want from our full Steam
        catalogue, and we'll deliver the keys over Telegram or WhatsApp.
      </p>

      <div className="bundle-grid">
        {BUNDLES.map((b) => (
          <BundleCard bundle={b} key={b.id} />
        ))}
      </div>

      <div className="content-block" style={{ marginTop: 40 }}>
        <h2>How it works</h2>
        <p>
          Pick a vault size, then choose the exact Steam titles you want using the vault builder — search our
          catalogue and add games until the vault is full, or leave some slots for us to fill with top sellers.
          When you continue, your list is sent to us on Telegram or WhatsApp and we confirm stock before you pay.
        </p>
      </div>
    </div>
  );
}
