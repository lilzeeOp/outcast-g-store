import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function About() {
  useDocumentTitle('About Us');
  return (
    <div className="container content-page">
      <div className="breadcrumb">
        <Link to="/">Home</Link> <span>/</span> <span>About Us</span>
      </div>
      <h1>About Outcast G Store</h1>
      <p className="lede">
        Outcast G Store is a digital game store built for players who want genuine keys at honest prices.
        We've been serving gamers for years, and the goal has never changed: real keys, fair pricing, fast delivery.
      </p>

      <div className="content-stats">
        <div className="content-stat">
          <strong>15,000+</strong>
          <span>Games &amp; digital products</span>
        </div>
        <div className="content-stat">
          <strong>20+</strong>
          <span>Years serving gamers</span>
        </div>
        <div className="content-stat">
          <strong>400k+</strong>
          <span>Trustpilot reviews</span>
        </div>
      </div>

      <div className="content-block">
        <h2>What we do</h2>
        <p>
          We source official digital keys directly from publishers and authorised distributors, then pass the
          savings on to you. Every order is backed by buyer protection and delivered straight to your inbox —
          usually within minutes.
        </p>
      </div>
      <div className="content-block">
        <h2>More than key codes</h2>
        <p>
          Our catalogue covers memberships, gift cards, top-ups and pre-orders across every major platform —
          all backed by the same pricing and service standards, no matter what you're buying.
        </p>
      </div>
      <div className="content-block">
        <h2>Our promise</h2>
        <p>
          Genuine keys, transparent pricing, and a support team that actually answers. If something's wrong with
          your order, we'll make it right.
        </p>
      </div>
    </div>
  );
}
