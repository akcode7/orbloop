// themes/colors.tsx
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect, useContext, createContext, ReactNode } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  // Core colors
  background: string;
  surface: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  border: string;
  borderLight: string;
  shadow: string;
  accent: string;
  error: string;
  warning: string;
  success: string;
  info: string;
  
  // Specific component colors
  modalOverlay: string;
  searchBackground: string;
  cardBackground: string;
  savedSectionBackground: string;
  filterButtonBackground: string;
  bottomNavBackground: string;
  headerBackground: string;
  inputBackground: string;
  buttonPrimary: string;
  buttonSecondary: string;
  buttonDisabled: string;
  
  // State colors
  hover: string;
  pressed: string;
  disabled: string;
  selected: string;
  
  // Badge and indicator colors
  trendingBadge: string;
  openSourceBadge: string;
  ratingBackground: string;
  categoryTabActive: string;
  categoryTabInactive: string;
  
  // Text on colored backgrounds
  textOnPrimary: string;
  textOnSecondary: string;
  textOnAccent: string;
  textOnError: string;
  textOnSuccess: string;
  textOnWarning: string;
}

const lightTheme: ThemeColors = {
  // Core colors
  background: '#f8f9fa',
  surface: '#ffffff',
  primary: '#007bff',
  primaryLight: '#66b3ff',
  primaryDark: '#0056b3',
  secondary: '#6c757d',
  text: '#212529',
  textSecondary: '#6c757d',
  textTertiary: '#adb5bd',
  border: '#e9ecef',
  borderLight: '#f8f9fa',
  shadow: '#000000',
  accent: '#17a2b8',
  error: '#dc3545',
  warning: '#ffc107',
  success: '#28a745',
  info: '#17a2b8',
  
  // Specific component colors
  modalOverlay: 'rgba(0, 0, 0, 0.5)',
  searchBackground: '#ffffff',
  cardBackground: '#ffffff',
  savedSectionBackground: '#e3f2fd',
  filterButtonBackground: '#e9ecef',
  bottomNavBackground: '#ffffff',
  headerBackground: '#ffffff',
  inputBackground: '#ffffff',
  buttonPrimary: '#007bff',
  buttonSecondary: '#6c757d',
  buttonDisabled: '#e9ecef',
  
  // State colors
  hover: '#f8f9fa',
  pressed: '#e9ecef',
  disabled: '#e9ecef',
  selected: '#e3f2fd',
  
  // Badge and indicator colors
  trendingBadge: '#ff4757',
  openSourceBadge: '#2ed573',
  ratingBackground: 'rgba(0, 0, 0, 0.7)',
  categoryTabActive: '#007bff',
  categoryTabInactive: '#e9ecef',
  
  // Text on colored backgrounds
  textOnPrimary: '#ffffff',
  textOnSecondary: '#ffffff',
  textOnAccent: '#ffffff',
  textOnError: '#ffffff',
  textOnSuccess: '#ffffff',
  textOnWarning: '#000000',

};

const darkTheme: ThemeColors = {
 // Core colors
  background: '#121212',
  surface: '#1e1e1e',
  primary: '#4A90E2',
  primaryLight: '#7db3e8',
  primaryDark: '#2c5aa0',
  secondary: '#888888',
  text: '#ffffff',
  textSecondary: '#b0b0b0',
  textTertiary: '#808080',
  border: '#333333',
  borderLight: '#404040',
  shadow: '#000000',
  accent: '#00d66a',
  error: '#ff6b6b',
  warning: '#ffcd3c',
  success: '#51cf66',
  info: '#4A90E2',
  
  // Specific component colors
  modalOverlay: 'rgba(0, 0, 0, 0.8)',
  searchBackground: '#2a2a2a',
  cardBackground: '#1e1e1e',
  savedSectionBackground: '#00d66a',
  filterButtonBackground: '#2a2a2a',
  bottomNavBackground: '#1e1e1e',
  headerBackground: '#1e1e1e',
  inputBackground: '#2a2a2a',
  buttonPrimary: '#4A90E2',
  buttonSecondary: '#888888',
  buttonDisabled: '#404040',
  
  // State colors
  hover: '#2a2a2a',
  pressed: '#333333',
  disabled: '#404040',
  selected: '#2a4a6b',
  
  // Badge and indicator colors
  trendingBadge: '#ff6b6b',
  openSourceBadge: '#51cf66',
  ratingBackground: 'rgba(0, 0, 0, 0.8)',
  categoryTabActive: '#4A90E2',
  categoryTabInactive: '#2a2a2a',
  
  // Text on colored backgrounds
  textOnPrimary: '#ffffff',
  textOnSecondary: '#ffffff',
  textOnAccent: '#000000',
  textOnError: '#ffffff',
  textOnSuccess: '#000000',
  textOnWarning: '#000000',
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