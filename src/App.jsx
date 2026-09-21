import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';

// Home ships eagerly (it's the landing page — no point flashing a loader on
// first paint). Everything else is route-level code-split so a visitor only
// downloads the JS for the page they're actually on.
const Category = lazy(() => import('./pages/Category'));
const Product = lazy(() => import('./pages/Product'));
const About = lazy(() => import('./pages/About'));
const Faq = lazy(() => import('./pages/Faq'));
const Bundles = lazy(() => import('./pages/Bundles'));
const VaultBuilder = lazy(() => import('./pages/VaultBuilder'));
const Legal = lazy(() => import('./pages/Legal'));
const NotFound = lazy(() => import('./pages/NotFound'));

function RouteFallback() {
  return (
    <div className="container" style={{ paddingBlock: 80 }}>
      <div className="boot-bars" style={{ margin: '0 auto' }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} style={{ animationDelay: `${i * 0.09}s` }} />
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="category/:key" element={<Category />} />
          <Route path="product/:id" element={<Product />} />
          <Route path="about-us" element={<About />} />
          <Route path="faq" element={<Faq />} />
          <Route path="bundles" element={<Bundles />} />
          <Route path="bundles/build/:tier" element={<VaultBuilder />} />
          <Route path="legal" element={<Legal />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
