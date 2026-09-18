import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const KEY = 'outcast_recently_viewed_v1';
const MAX = 8;
const RecentlyViewedContext = createContext(null);

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function RecentlyViewedProvider({ children }) {
  const [ids, setIds] = useState(load);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(ids));
  }, [ids]);

  const record = useCallback((id) => {
    setIds((prev) => [id, ...prev.filter((x) => x !== id)].slice(0, MAX));
  }, []);

  return <RecentlyViewedContext.Provider value={{ ids, record }}>{children}</RecentlyViewedContext.Provider>;
}

export function useRecentlyViewed() {
  const ctx = useContext(RecentlyViewedContext);
  if (!ctx) throw new Error('useRecentlyViewed must be used within RecentlyViewedProvider');
  return ctx;
}
