import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

// Buyer-chosen games for each bundle tier ("vault"). Persisted in
// localStorage so a refresh or a return visit keeps the picks.
const KEY = 'outcast_vault_picks_v1';
const VaultContext = createContext(null);

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

// Short shareable code for a pick list: URL-safe base64 of the comma-joined ids.
export function encodePicks(ids) {
  return btoa(ids.join(',')).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodePicks(code) {
  try {
    const b64 = code.replace(/-/g, '+').replace(/_/g, '/');
    return atob(b64).split(',').filter(Boolean);
  } catch {
    return [];
  }
}

export function VaultProvider({ children }) {
  const [vaults, setVaults] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(vaults));
    } catch {
      /* storage unavailable */
    }
  }, [vaults]);

  const picksFor = useCallback((tier) => vaults[tier] || [], [vaults]);

  const setPicks = useCallback((tier, ids) => {
    setVaults((v) => ({ ...v, [tier]: [...new Set(ids)] }));
  }, []);

  const add = useCallback((tier, id, max) => {
    setVaults((v) => {
      const cur = v[tier] || [];
      if (cur.includes(id) || cur.length >= max) return v;
      return { ...v, [tier]: [...cur, id] };
    });
  }, []);

  const remove = useCallback((tier, id) => {
    setVaults((v) => ({ ...v, [tier]: (v[tier] || []).filter((x) => x !== id) }));
  }, []);

  const clear = useCallback((tier) => {
    setVaults((v) => ({ ...v, [tier]: [] }));
  }, []);

  const value = useMemo(() => ({ vaults, picksFor, setPicks, add, remove, clear }), [vaults, picksFor, setPicks, add, remove, clear]);
  return <VaultContext.Provider value={value}>{children}</VaultContext.Provider>;
}

export function useVault() {
  const ctx = useContext(VaultContext);
  if (!ctx) throw new Error('useVault must be used within VaultProvider');
  return ctx;
}
