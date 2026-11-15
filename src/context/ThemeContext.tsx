import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { themeStorage } from "../models/storage";
import type { Theme } from "../types/theme";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => themeStorage.get() ?? "dark");

  useEffect(() => {
    document.documentElement.dataset.theme = theme; // Tailwind's `dark:` variant reads this attribute
    themeStorage.set(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
