import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function Legal() {
  useDocumentTitle('Legal');
  return (
    <div className="container content-page">
      <div className="breadcrumb">
        <Link to="/">Home</Link> <span>/</span> <span>Legal</span>
      </div>
      <h1>Legal</h1>
      <p className="lede">Last updated September 2026. Demo copy written for this project — not real legal text.</p>

      <div className="content-block">
        <h2 style={{ fontSize: 20 }}>Privacy Policy</h2>
      </div>
      <div className="content-block">
        <h2>What we collect</h2>
        <p>
          When you create an account, we collect the information needed to identify you — your name, email
          address, and password. We don't collect more than we need.
        </p>
      </div>
      <div className="content-block">
        <h2>How we use it</h2>
        <p>
          Your data is used to run your account and, if you opt in, send deal notifications. We never sell your
          personal information to third parties.
        </p>
      </div>
      <div className="content-block">
        <h2>Your rights</h2>
        <p>
          You can request a copy of your data or ask us to delete your account at any time by contacting support
          on Telegram or WhatsApp.
        </p>
      </div>

      <div className="content-block" style={{ marginTop: 40 }}>
        <h2 style={{ fontSize: 20 }}>Terms &amp; Conditions</h2>
      </div>
      <div className="content-block">
        <h2>Orders &amp; delivery</h2>
        <p>
          Purchases are arranged directly with the seller over Telegram or WhatsApp. Digital keys are delivered to
          your email, typically within minutes of payment confirmation.
        </p>
      </div>
      <div className="content-block">
        <h2>Refunds</h2>
        <p>
          Unactivated keys are eligible for a refund within 30 days of purchase. Once a key has been activated on
          its platform, it can no longer be refunded, in line with standard digital goods policy.
        </p>
      </div>
      <div className="content-block">
        <h2>Account use</h2>
        <p>
          Accounts are for personal use. Reselling keys purchased through Outcast G Store outside of our platform
          violates these terms and may result in account suspension.
        </p>
      </div>
      <div className="content-block">
        <h2>Changes</h2>
        <p>We may update these terms from time to time; continued use of the site means you accept the current version.</p>
      </div>
    </div>
  );
}
