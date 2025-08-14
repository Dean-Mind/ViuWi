'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'viuwi-light' | 'viuwi-dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('viuwi-light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Safer localStorage access with error handling
    let savedTheme: Theme | null = null;
    try {
      const stored = localStorage.getItem('viuwi-theme') as Theme;
      if (stored && (stored === 'viuwi-light' || stored === 'viuwi-dark')) {
        savedTheme = stored;
      }
    } catch (error) {
      console.warn('Failed to access localStorage for theme:', error);
    }

    if (savedTheme) {
      setThemeState(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // Fallback to system preference with error handling
      try {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const defaultTheme = prefersDark ? 'viuwi-dark' : 'viuwi-light';
        setThemeState(defaultTheme);
        document.documentElement.setAttribute('data-theme', defaultTheme);
      } catch (error) {
        console.warn('Failed to detect system theme preference:', error);
        // Ultimate fallback
        setThemeState('viuwi-light');
        document.documentElement.setAttribute('data-theme', 'viuwi-light');
      }
    }
  }, []);

  const toggleTheme = () => {
    if (!mounted) return;

    const newTheme = theme === 'viuwi-light' ? 'viuwi-dark' : 'viuwi-light';
    setThemeState(newTheme);

    try {
      localStorage.setItem('viuwi-theme', newTheme);
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }

    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const setTheme = (newTheme: Theme) => {
    if (!mounted) return;

    setThemeState(newTheme);

    try {
      localStorage.setItem('viuwi-theme', newTheme);
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }

    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        isDark: theme === 'viuwi-dark',
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // Return default values instead of throwing error
    return {
      theme: 'viuwi-light' as Theme,
      toggleTheme: () => {},
      setTheme: () => {},
      isDark: false,
    };
  }
  return context;
}