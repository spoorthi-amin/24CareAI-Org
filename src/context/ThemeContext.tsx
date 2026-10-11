import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeColor, AppearanceMode, FontSize, LayoutDensity, CardRadius, THEME_CONFIGS, ThemeConfig } from '../types/theme';

interface ThemeContextType {
  themeColor: ThemeColor;
  setThemeColor: (color: ThemeColor) => void;
  appearanceMode: AppearanceMode;
  setAppearanceMode: (mode: AppearanceMode) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  layoutDensity: LayoutDensity;
  setLayoutDensity: (density: LayoutDensity) => void;
  cardRadius: CardRadius;
  setCardRadius: (radius: CardRadius) => void;
  reducedMotion: boolean;
  setReducedMotion: (reduced: boolean) => void;
  activeConfig: ThemeConfig;
  isDark: boolean;
  resetToDefaults: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeColor, setThemeColorState] = useState<ThemeColor>(() => {
    return (localStorage.getItem('24care_theme_color') as ThemeColor) || 'mint';
  });

  const [appearanceMode, setAppearanceModeState] = useState<AppearanceMode>(() => {
    return (localStorage.getItem('24care_appearance_mode') as AppearanceMode) || 'light';
  });

  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    return (localStorage.getItem('24care_font_size') as FontSize) || 'standard';
  });

  const [layoutDensity, setLayoutDensityState] = useState<LayoutDensity>(() => {
    return (localStorage.getItem('24care_layout_density') as LayoutDensity) || 'comfortable';
  });

  const [cardRadius, setCardRadiusState] = useState<CardRadius>(() => {
    return (localStorage.getItem('24care_card_radius') as CardRadius) || 'modern';
  });

  const [reducedMotion, setReducedMotionState] = useState<boolean>(() => {
    return localStorage.getItem('24care_reduced_motion') === 'true';
  });

  const [isSystemDark, setIsSystemDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Listen to system dark mode changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setIsSystemDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const isDark = appearanceMode === 'dark' || (appearanceMode === 'system' && isSystemDark);
  const activeConfig = THEME_CONFIGS[themeColor] || THEME_CONFIGS.mint;

  // Apply theme tokens and styles to DOM
  useEffect(() => {
    const root = document.documentElement;

    // Dark class
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Colors
    root.style.setProperty('--color-primary', activeConfig.actionGreen);
    root.style.setProperty('--color-primary-light', activeConfig.primaryMint);
    root.style.setProperty('--color-primary-dark', activeConfig.deepForest);
    root.style.setProperty('--color-sage', activeConfig.softSage);

    if (isDark) {
      root.style.setProperty('--bg-app', activeConfig.darkBg);
      root.style.setProperty('--surface-card', activeConfig.darkSurface);
      root.style.setProperty('--surface-card-subtle', '#0B221B');
      root.style.setProperty('--border-subtle', 'rgba(255, 255, 255, 0.12)');
      root.style.setProperty('--text-primary', '#F9FAFB');
      root.style.setProperty('--text-secondary', '#9CA3AF');
    } else {
      root.style.setProperty('--bg-app', activeConfig.paleMintBg);
      root.style.setProperty('--surface-card', activeConfig.surface);
      root.style.setProperty('--surface-card-subtle', activeConfig.softSage);
      root.style.setProperty('--border-subtle', '#E5E7EB');
      root.style.setProperty('--text-primary', '#111827');
      root.style.setProperty('--text-secondary', '#4B5563');
    }

    // Card radius
    root.style.setProperty('--radius-card', cardRadius === 'soft' ? '1.25rem' : '0.875rem');
    root.style.setProperty('--radius-btn', cardRadius === 'soft' ? '0.75rem' : '0.5rem');

    // Font size
    root.style.setProperty('--font-scale', fontSize === 'large' ? '1.08' : '1');

    // Layout density
    root.style.setProperty('--spacing-density', layoutDensity === 'compact' ? '0.75rem' : layoutDensity === 'spacious' ? '1.5rem' : '1.125rem');

    // Reduced motion
    if (reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
  }, [themeColor, appearanceMode, isDark, activeConfig, cardRadius, fontSize, layoutDensity, reducedMotion]);

  const setThemeColor = (color: ThemeColor) => {
    setThemeColorState(color);
    localStorage.setItem('24care_theme_color', color);
    syncBackendPreferences({ preferredTheme: color });
  };

  const setAppearanceMode = (mode: AppearanceMode) => {
    setAppearanceModeState(mode);
    localStorage.setItem('24care_appearance_mode', mode);
    syncBackendPreferences({ appearanceMode: mode });
  };

  const setFontSize = (size: FontSize) => {
    setFontSizeState(size);
    localStorage.setItem('24care_font_size', size);
    syncBackendPreferences({ fontSize: size });
  };

  const setLayoutDensity = (density: LayoutDensity) => {
    setLayoutDensityState(density);
    localStorage.setItem('24care_layout_density', density);
    syncBackendPreferences({ layoutDensity: density });
  };

  const setCardRadius = (radius: CardRadius) => {
    setCardRadiusState(radius);
    localStorage.setItem('24care_card_radius', radius);
    syncBackendPreferences({ cardRadius: radius });
  };

  const setReducedMotion = (reduced: boolean) => {
    setReducedMotionState(reduced);
    localStorage.setItem('24care_reduced_motion', String(reduced));
    syncBackendPreferences({ reducedMotion: reduced });
  };

  const resetToDefaults = () => {
    setThemeColor('mint');
    setAppearanceMode('light');
    setFontSize('standard');
    setLayoutDensity('comfortable');
    setCardRadius('modern');
    setReducedMotion(false);
  };

  // Helper to sync with server if logged in
  const syncBackendPreferences = async (prefs: Record<string, any>) => {
    const token = localStorage.getItem('24care_token');
    if (!token) return;
    try {
      await fetch('/api/user/appearance', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(prefs),
      });
    } catch {
      // Quiet local fallback
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        themeColor,
        setThemeColor,
        appearanceMode,
        setAppearanceMode,
        fontSize,
        setFontSize,
        layoutDensity,
        setLayoutDensity,
        cardRadius,
        setCardRadius,
        reducedMotion,
        setReducedMotion,
        activeConfig,
        isDark,
        resetToDefaults,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
