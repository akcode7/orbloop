// themes/colors.ts
import { useColorScheme } from 'react-native';

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

export const useTheme = (): ThemeColors => {
  const colorScheme = useColorScheme();
  return colorScheme === 'dark' ? darkTheme : lightTheme;
};

export const useIsDarkMode = (): boolean => {
  const colorScheme = useColorScheme();
  return colorScheme === 'dark';
};