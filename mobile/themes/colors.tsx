// themes/colors.tsx
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect, useContext, createContext, ReactNode } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  background: string;
  surface: string;
  primary: string;
  secondary: string;
  text: string;
  textSecondary: string;
  border: string;
  shadow: string;
  accent: string;
  error: string;
  success: string;
  modalOverlay: string;
  searchBackground: string;
  cardBackground: string;
  savedSectionBackground: string;
  filterButtonBackground: string;
  bottomNavBackground: string;
}

const lightTheme: ThemeColors = {
  background: '#f8f9fa',
  surface: '#ffffff',
  primary: '#007bff',
  secondary: '#6c757d',
  text: '#212529',
  textSecondary: '#6c757d',
  border: '#e9ecef',
  shadow: '#000000',
  accent: '#17a2b8',
  error: '#dc3545',
  success: '#28a745',
  modalOverlay: 'rgba(0, 0, 0, 0.5)',
  searchBackground: '#ffffff',
  cardBackground: '#ffffff',
  savedSectionBackground: '#e3f2fd',
  filterButtonBackground: '#e9ecef',
  bottomNavBackground: '#ffffff',
};

const darkTheme: ThemeColors = {
  background: '#1a1a1a',
  surface: '#2a2a2a',
  primary: '#4A90E2',
  secondary: '#7a7a7a',
  text: '#ffffff',
  textSecondary: '#a0a0a0',
  border: '#333333',
  shadow: '#000000',
  accent: '#00d66a',
  error: '#ff6b6b',
  success: '#51cf66',
  modalOverlay: 'rgba(0, 0, 0, 0.7)',
  searchBackground: '#2d5a3d',
  cardBackground: '#2a2a2a',
  savedSectionBackground: '#00d66a',
  filterButtonBackground: '#2d5a3d',
  bottomNavBackground: '#1a1a1a',
};

interface ThemeContextType {
  theme: ThemeColors;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@theme_mode';

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    loadThemeMode();
  }, []);

  const loadThemeMode = async () => {
    try {
      const savedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedMode) {
        setThemeModeState(savedMode as ThemeMode);
      }
    } catch (error) {
      console.error('Error loading theme mode:', error);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
      setThemeModeState(mode);
    } catch (error) {
      console.error('Error saving theme mode:', error);
    }
  };

  const getEffectiveTheme = (): ThemeColors => {
    if (themeMode === 'system') {
      return systemColorScheme === 'dark' ? darkTheme : lightTheme;
    }
    return themeMode === 'dark' ? darkTheme : lightTheme;
  };

  const isDarkMode = themeMode === 'system' 
    ? systemColorScheme === 'dark' 
    : themeMode === 'dark';

  return (
    <ThemeContext.Provider 
      value={{
        theme: getEffectiveTheme(),
        themeMode,
        setThemeMode,
        isDarkMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

// Main theme hooks - use context when available, fallback to system theme
export const useTheme = (): ThemeColors => {
  const context = useContext(ThemeContext);
  if (context) {
    return context.theme;
  }
  // Fallback for components not wrapped in ThemeProvider
  const colorScheme = useColorScheme();
  return colorScheme === 'dark' ? darkTheme : lightTheme;
};

export const useIsDarkMode = (): boolean => {
  const context = useContext(ThemeContext);
  if (context) {
    return context.isDarkMode;
  }
  // Fallback for components not wrapped in ThemeProvider
  const colorScheme = useColorScheme();
  return colorScheme === 'dark';
};

export default ThemeProvider;