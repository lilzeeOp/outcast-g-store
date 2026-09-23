import { useEffect, useRef, useState } from 'react';

// Horizontal card row with a soft edge fade and arrow buttons, so a
// half-visible last card reads as "scroll for more" instead of "cut off".
export default function Scroller({ children, className = '' }) {
  const ref = useRef(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const update = () => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setEdges({ start: el.scrollLeft <= 2, end: el.scrollLeft >= max - 24 });
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    update();
    el.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    const mo = new MutationObserver(update);
    mo.observe(el, { childList: true });
    return () => {
      el.removeEventListener('scroll', update);
      ro.disconnect();
      mo.disconnect();
    };
  }, []);

  // Animate scrollLeft ourselves: programmatic smooth scrolling on a container
  // that also has CSS scroll-behavior gets cancelled in some browsers.
  const step = (dir) => {
    const el = ref.current;
    if (!el) return;
    const from = el.scrollLeft;
    const max = el.scrollWidth - el.clientWidth;
    let to = Math.min(max, Math.max(0, from + dir * Math.max(240, el.clientWidth * 0.8)));
    // Land exactly on an edge when close, so the arrows/fades switch off cleanly.
    if (max - to < 120) to = max;
    if (to < 120) to = 0;
    const t0 = performance.now();
    const dur = 320;
    const tick = (now) => {
      const k = Math.min(1, (now - t0) / dur);
      const ease = 1 - Math.pow(1 - k, 3);
      el.scrollLeft = from + (to - from) * ease;
      if (k < 1) requestAnimationFrame(tick);
      else update();
    };
    requestAnimationFrame(tick);
  };

  return (
    <div className={`scroller ${edges.start ? 'at-start' : ''} ${edges.end ? 'at-end' : ''} ${className}`}>
      <div className="product-scroller" ref={ref}>
        {children}
      </div>
      <button type="button" className="scroller__arrow scroller__arrow--prev" aria-label="Scroll back" onClick={() => step(-1)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m15 6-6 6 6 6" /></svg>
      </button>
      <button type="button" className="scroller__arrow scroller__arrow--next" aria-label="Scroll forward" onClick={() => step(1)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m9 6 6 6-6 6" /></svg>
      </button>
    </div>
  );
}
