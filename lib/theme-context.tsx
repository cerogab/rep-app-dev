import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeName = 'orange' | 'blueOrange';

export interface ThemeColors {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  accent: string;
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  chipNew: string;
  chipContacted: string;
  chipQualified: string;
  chipUnknown: string;
  white: string;
  black: string;
  inputBg: string;
  overlay: string;
  granite: string;
  greyOlive: string;
  mutedTeal: string;
  mutedTealLight: string;
  pearlAqua: string;
  aquamarine: string;
  softCyan: string;
  chartAccent1: string;
  chartAccent2: string;
  chartAccent3: string;
  chartGrid: string;
  tabIconDefault: string;
  tabIconSelected: string;
}

const orangeTheme: ThemeColors = {
  primary: '#E8762D',
  primaryDark: '#2D1408',
  primaryLight: '#F09440',
  accent: '#D04525',
  background: '#FDF6F0',
  card: '#FFFFFF',
  text: '#2D1408',
  textSecondary: '#8B6F55',
  textTertiary: '#A69279',
  border: '#E8DDD3',
  success: '#E8A84C',
  warning: '#D4956A',
  error: '#D04525',
  chipNew: '#E8762D',
  chipContacted: '#D4956A',
  chipQualified: '#E8A84C',
  chipUnknown: '#A69279',
  white: '#FFFFFF',
  black: '#000000',
  inputBg: '#FBF5EF',
  overlay: 'rgba(45, 20, 8, 0.4)',
  granite: '#8B6F55',
  greyOlive: '#A69279',
  mutedTeal: '#D4956A',
  mutedTealLight: '#E8B87A',
  pearlAqua: '#E8A84C',
  aquamarine: '#F0C060',
  softCyan: '#F5D080',
  chartAccent1: '#E8762D',
  chartAccent2: '#E8B87A',
  chartAccent3: '#F0C060',
  chartGrid: '#A69279',
  tabIconDefault: '#A69279',
  tabIconSelected: '#E8762D',
};

const blueOrangeTheme: ThemeColors = {
  primary: '#00068E',
  primaryDark: '#000456',
  primaryLight: '#66AAE3',
  accent: '#E49716',
  background: '#F0F4F8',
  card: '#FFFFFF',
  text: '#1A1A2E',
  textSecondary: '#9A8E89',
  textTertiary: '#B0A89F',
  border: '#D8DDE3',
  success: '#E49716',
  warning: '#EA802B',
  error: '#D04525',
  chipNew: '#EA802B',
  chipContacted: '#66AAE3',
  chipQualified: '#E49716',
  chipUnknown: '#9A8E89',
  white: '#FFFFFF',
  black: '#000000',
  inputBg: '#EEF2F7',
  overlay: 'rgba(0, 6, 142, 0.4)',
  granite: '#9A8E89',
  greyOlive: '#B0A89F',
  mutedTeal: '#66AAE3',
  mutedTealLight: '#99C8EE',
  pearlAqua: '#E49716',
  aquamarine: '#EA802B',
  softCyan: '#66AAE3',
  chartAccent1: '#00068E',
  chartAccent2: '#66AAE3',
  chartAccent3: '#E49716',
  chartGrid: '#9A8E89',
  tabIconDefault: '#9A8E89',
  tabIconSelected: '#00068E',
};

export const themes: Record<ThemeName, ThemeColors> = {
  orange: orangeTheme,
  blueOrange: blueOrangeTheme,
};

const THEME_STORAGE_KEY = '@bram_theme';

interface ThemeContextType {
  themeName: ThemeName;
  colors: ThemeColors;
  setTheme: (name: ThemeName) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType>({
  themeName: 'orange',
  colors: orangeTheme,
  setTheme: async () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>('orange');

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY).then((stored) => {
      if (stored === 'orange' || stored === 'blueOrange') {
        setThemeName(stored);
      }
    });
  }, []);

  const setTheme = async (name: ThemeName) => {
    setThemeName(name);
    await AsyncStorage.setItem(THEME_STORAGE_KEY, name);
  };

  const colors = useMemo(() => themes[themeName], [themeName]);

  return (
    <ThemeContext.Provider value={{ themeName, colors, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export function useColors(): ThemeColors {
  const { colors } = useContext(ThemeContext);
  return colors;
}
