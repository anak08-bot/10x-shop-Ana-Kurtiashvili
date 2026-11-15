import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { accountsStorage, userStorage } from "../models/storage";
import type { AuthUser, ProfileForm, StoredAccount, UserProfile } from "../types/user";

export type RegisterResult = { ok: true } | { ok: false; message: string };

interface AuthContextValue {
  user: AuthUser | null; // null = guest
  isLoggedIn: boolean;
  login: (username: string) => void;
  register: (account: StoredAccount) => RegisterResult;
  logout: () => void;
  updateProfile: (profile: ProfileForm) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const EMPTY_PROFILE: UserProfile = { firstName: "", lastName: "", email: "", phone: "" };
const keyOf = (username: string): string => username.trim().toLowerCase();

/**
 * Local simulation of authentication (no server, no real credentials).
 * The session (username + profile) is kept in localStorage so a refresh doesn't log you out.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => userStorage.get());

  useEffect(() => {
    if (user) userStorage.set(user);
    else userStorage.remove();
  }, [user]);

  const login = useCallback((username: string) => {
    const name = username.trim();
    const saved = accountsStorage.get()?.[keyOf(name)];
    // A registered username gets its saved profile back; any other name logs in with an empty profile.
    setUser(saved ? { ...saved, isLoggedIn: true } : { username: name, ...EMPTY_PROFILE, isLoggedIn: true });
  }, []);

  const register = useCallback((account: StoredAccount): RegisterResult => {
    const accounts = accountsStorage.get() ?? {};
    const key = keyOf(account.username);
    if (accounts[key]) return { ok: false, message: "This username is already registered. Try logging in." };
    const clean: StoredAccount = {
      username: account.username.trim(),
      firstName: account.firstName.trim(),
      lastName: account.lastName.trim(),
      email: account.email.trim(),
      phone: account.phone.trim(),
    };
    accountsStorage.set({ ...accounts, [key]: clean });
    setUser({ ...clean, isLoggedIn: true });
    return { ok: true };
  }, []);

  const logout = useCallback(() => setUser(null), []); // the cart is NOT touched

  const updateProfile = useCallback(
    (profile: ProfileForm) => {
      if (!user) return;
      const next: AuthUser = { ...user, ...profile };
      const accounts = accountsStorage.get();
      if (accounts?.[keyOf(user.username)]) {
        const account: StoredAccount = {
          username: next.username,
          firstName: next.firstName,
          lastName: next.lastName,
          email: next.email,
          phone: next.phone,
        };
        accountsStorage.set({ ...accounts, [keyOf(user.username)]: account });
      }
      setUser(next);
    },
    [user],
  );

  const value = useMemo<AuthContextValue>(
    () => ({ user, isLoggedIn: user !== null, login, register, logout, updateProfile }),
    [user, login, register, logout, updateProfile],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
