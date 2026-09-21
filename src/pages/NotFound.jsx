import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function NotFound() {
  useDocumentTitle('Page not found');
  useEffect(() => {
    const m = document.createElement('meta');
    m.name = 'robots';
    m.content = 'noindex';
    document.head.appendChild(m);
    return () => m.remove();
  }, []);
  return (
    <div className="container content-page" style={{ textAlign: 'center', paddingBlock: 80 }}>
      <h1 style={{ fontSize: 72, marginBottom: 6 }}>404</h1>
      <p className="lede" style={{ marginBottom: 24 }}>
        This page doesn't exist — it might have been moved, or the key you followed expired.
      </p>
      <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex' }}>
        Back to Home
      </Link>
    </div>
  );
}
