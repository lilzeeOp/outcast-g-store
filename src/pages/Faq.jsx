import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';

const FAQS = [
  {
    q: 'How fast will I receive my key?',
    a: 'Almost all orders deliver instantly to your account email. Some pre-orders and high-demand titles may take longer during peak launch traffic.',
  },
  {
    q: 'Are CD keys legit?',
    a: 'Yes — every key is sourced directly from publishers or authorised distributors and activates on the official platform (Steam, PlayStation Network, Xbox, or Nintendo eShop).',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'Visa, Mastercard, PayPal, Apple Pay and Google Pay are all supported at checkout.',
  },
  {
    q: 'Can I get a refund on an unactivated key?',
    a: 'Yes, unactivated keys are eligible for a refund within 30 days of purchase. Activated keys cannot be refunded per platform policy.',
  },
  {
    q: 'Do keys work in my region?',
    a: "Region restrictions are listed on each product page before checkout. If a title is region-locked, we'll say so clearly on the listing.",
  },
  {
    q: 'Who is Outcast G Store?',
    a: "We're an independent digital game store focused on genuine games, fair prices, and fast, no-hassle delivery.",
  },
];

export default function Faq() {
  useDocumentTitle('FAQ');
  return (
    <div className="container content-page">
      <div className="breadcrumb">
        <Link to="/">Home</Link> <span>/</span> <span>FAQ</span>
      </div>
      <h1>Frequently Asked Questions</h1>
      <p className="lede">Everything you need to know about buying, redeeming, and getting support for your games.</p>

      {FAQS.map((item) => (
        <details className="faq-item" key={item.q}>
          <summary>{item.q}</summary>
          <p>{item.a}</p>
        </details>
      ))}
    </div>
  );
}
