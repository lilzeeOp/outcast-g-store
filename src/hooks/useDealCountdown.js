import { useEffect, useState } from 'react';
import { hash } from '../data/products';

const STORE_KEY = 'outcast_deal_deadlines_v1';

function loadDeadlines() {
  try {
    return JSON.parse(sessionStorage.getItem(STORE_KEY)) || {};
  } catch {
    return {};
  }
}

// Deterministic-but-session-stable "deal ends in" countdown: the first time a
// product is seen this session we pick a deadline 2-18h out (seeded from its
// id) and remember it, so the timer counts down consistently rather than
// resetting on every render/navigation.
function deadlineFor(productId) {
  const deadlines = loadDeadlines();
  if (deadlines[productId]) return deadlines[productId];
  const hoursOut = 2 + (hash(productId) % 16);
  const deadline = Date.now() + hoursOut * 60 * 60 * 1000;
  deadlines[productId] = deadline;
  try {
    sessionStorage.setItem(STORE_KEY, JSON.stringify(deadlines));
  } catch {
    /* ignore */
  }
  return deadline;
}

function format(msRemaining) {
  if (msRemaining <= 0) return null;
  const totalMinutes = Math.floor(msRemaining / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

export default function useDealCountdown(productId) {
  const [label, setLabel] = useState(() => format(deadlineFor(productId) - Date.now()));

  useEffect(() => {
    const deadline = deadlineFor(productId);
    const tick = () => setLabel(format(deadline - Date.now()));
    tick();
    const t = setInterval(tick, 30000);
    return () => clearInterval(t);
  }, [productId]);

  return label;
}
