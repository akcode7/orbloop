import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme, useIsDarkMode } from '../themes/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  icon?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  icon,
  style,
  textStyle,
}) => {
  const theme = useTheme();
  const isDarkMode = useIsDarkMode();
  const styles = createStyles(theme, isDarkMode);

  const buttonStyle = [
    styles.button,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    style,
  ];

  const textStyleCombined = [
    styles.buttonText,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text style={textStyleCombined}>{title}</Text>
    </TouchableOpacity>
  );
};

const createStyles = (theme: any, isDarkMode: boolean) => StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  // Variants
  primary: {
    backgroundColor: isDarkMode ? '#00ff88' : theme.primary,
  },
  secondary: {
    backgroundColor: isDarkMode ? '#00ff88' : theme.accent,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: isDarkMode ? '#00ff88' : theme.border,
  },
  // Sizes
  small: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  medium: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  large: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  // Disabled state
  disabled: {
    opacity: 0.5,
  },
  // Text styles
  buttonText: {
    fontWeight: '500',
    textAlign: 'center',
  },
  primaryText: {
    color: isDarkMode ? '#000000' : '#ffffff',
    fontSize: 14,
  },
  secondaryText: {
    color: isDarkMode ? '#000000' : (theme.accent === '#00d66a' ? '#000000' : '#ffffff'),
    fontSize: 14,
  },
  outlineText: {
    color: isDarkMode ? '#00ff88' : theme.text,
    fontSize: 14,
  },
  smallText: {
    fontSize: 12,
  },
  mediumText: {
    fontSize: 14,
  },
  largeText: {
    fontSize: 16,
  },
  disabledText: {
    opacity: 0.7,
  },
  icon: {
    fontSize: 14,
    marginRight: 8,
  },
});

export default Button;