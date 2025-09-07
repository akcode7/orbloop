// components/FilterButton.tsx
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../themes/colors';

interface FilterButtonProps {
  title: string;
  onPress: () => void;
  icon?: string;
  isActive?: boolean;
  hasDropdown?: boolean;
  style?: ViewStyle;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  title,
  onPress,
  icon,
  isActive = false,
  hasDropdown = false,
  style,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isActive && styles.activeButton,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text style={[styles.text, isActive && styles.activeText]}>
        {title}
      </Text>
      {hasDropdown && (
        <Text style={[styles.dropdown, isActive && styles.activeText]}>
          ▼
        </Text>
      )}
    </TouchableOpacity>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.filterButtonBackground,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.border,
  },
  activeButton: {
    backgroundColor: theme.accent,
  },
  icon: {
    fontSize: 14,
    marginRight: 5,
  },
  text: {
    color: theme.text,
    fontSize: 14,
    fontWeight: '500',
  },
  activeText: {
    color: theme.accent === '#00d66a' ? '#000000' : '#ffffff',
  },
  dropdown: {
    fontSize: 12,
    color: theme.text,
    marginLeft: 5,
  },
});

export default FilterButton;