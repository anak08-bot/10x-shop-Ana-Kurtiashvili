import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { CoronationOverlay } from "../components/royal/CoronationOverlay";
import { royalStorage } from "../models/storage";
import type { RoyalState } from "../utils/guards";

interface Celebration {
  first: boolean; // true = this purchase just made the customer a Royal Member
  total: number;
  key: number; // changes on every celebration so the animation restarts
}

interface RoyalContextValue {
  isMember: boolean;
  since: string | null;
  purchases: number;
  /** Call once when a purchase succeeds: records it and shows the coronation. */
  celebratePurchase: (total: number) => void;
  /** Forget the membership (used when the profile's data is cleared). */
  resetMembership: () => void;
}

const RoyalContext = createContext<RoyalContextValue | null>(null);

export function RoyalProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<RoyalState | null>(() => royalStorage.get());
  const [celebration, setCelebration] = useState<Celebration | null>(null);

  const celebratePurchase = useCallback(
    (total: number) => {
      const first = state === null;
      const next: RoyalState = state ? { ...state, purchases: state.purchases + 1 } : { since: new Date().toISOString(), purchases: 1 };
      royalStorage.set(next);
      setState(next);
      setCelebration({ first, total, key: Date.now() });
    },
    [state],
  );

  const resetMembership = useCallback(() => {
    royalStorage.remove();
    setState(null);
  }, []);

  const value = useMemo<RoyalContextValue>(
    () => ({ isMember: state !== null, since: state?.since ?? null, purchases: state?.purchases ?? 0, celebratePurchase, resetMembership }),
    [state, celebratePurchase, resetMembership],
  );

  return (
    <RoyalContext.Provider value={value}>
      {children}
      {celebration && <CoronationOverlay key={celebration.key} first={celebration.first} total={celebration.total} onClose={() => setCelebration(null)} />}
    </RoyalContext.Provider>
  );
}

export function useRoyal(): RoyalContextValue {
  const ctx = useContext(RoyalContext);
  if (!ctx) throw new Error("useRoyal must be used inside <RoyalProvider>");
  return ctx;
}
