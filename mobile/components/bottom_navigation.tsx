// components/BottomNavigation.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme, useIsDarkMode } from '../themes/colors';

interface BottomNavigationProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabPress,
}) => {
  const theme = useTheme();
  const isDarkMode = useIsDarkMode();

  const tabs = [
    { id: 'home', name: 'Home', icon: '🏠' },
    { id: 'explore', name: 'Explore', icon: '🔍' },
    { id: 'saved', name: 'Saved', icon: '🔖' },
    { id: 'settings', name: 'Settings', icon: '⚙️' },
  ];

  return (
    <View style={[styles.container, { 
      backgroundColor: theme.surface,
      borderTopColor: theme.border,
      shadowColor: isDarkMode ? '#000' : '#000',
    }]}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[
            styles.tab,
            activeTab === tab.id && { backgroundColor: theme.primaryLight }
          ]}
          onPress={() => onTabPress(tab.id)}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.icon,
            activeTab === tab.id && { color: theme.primary }
          ]}>
            {tab.icon}
          </Text>
          <Text style={[
            styles.label,
            { color: activeTab === tab.id ? theme.primary : theme.textSecondary }
          ]}>
            {tab.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 80,
    paddingBottom: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 12,
  },
  icon: {
    fontSize: 20,
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default BottomNavigation;