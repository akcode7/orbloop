// components/BottomNavigation.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme, useIsDarkMode } from '../themes/colors';
import HomeIcon from '../src/assets/icons/home_icon';
import SearchIcon from '../src/assets/icons/search_icon';
import SavedIcon from '../src/assets/icons/saved_icon';
import LearnIcon from '../src/assets/icons/learn_icon';

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

   const getIcon = (tabId: string, isActive: boolean) => {
    const iconColor = isActive ? theme.primary : theme.textSecondary;
    const iconSize = 20;
    
    switch (tabId) {
      case 'home':
        return <HomeIcon width={iconSize} height={iconSize} fill={iconColor} />;
      case 'explore':
        return <SearchIcon width={iconSize} height={iconSize} fill={iconColor} />;
      case 'saved':
        return <SavedIcon width={iconSize} height={iconSize} fill={iconColor} />;
      case 'learn':
        return <LearnIcon width={iconSize} height={iconSize} fill={iconColor} />;
      default:
        return null;
    }
  };

  const tabs = [
    { id: 'home', name: 'Home'},
    { id: 'explore', name: 'Explore'},
    { id: 'saved', name: 'Saved'},
    { id: 'learn', name: 'Learn'},
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
            activeTab === tab.id && { backgroundColor: theme.background }
          ]}
          onPress={() => onTabPress(tab.id)}
          activeOpacity={0.7}
        >
          <View style={styles.iconContainer}>
            {getIcon(tab.id, activeTab === tab.id)}
          </View>
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
  iconContainer: {
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default BottomNavigation;