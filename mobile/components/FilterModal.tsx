// components/FilterModal.tsx
import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { useTheme, useIsDarkMode } from '../themes/colors';
import CoursesIcon from '../src/assets/icons/courses_icon';
import DeveloperIcon from '../src/assets/icons/developer_icon';
import VideoEditingIcon from '../src/assets/icons/video_editing_icon';
import PhotoEditIcon from '../src/assets/icons/photo_edit_icon';
import ContentWritingIcon from '../src/assets/icons/content_writing_icon';
import PromptIcon from '../src/assets/icons/prompt_icon';
import PremiumIcon from '../src/assets/icons/premium_icon';
import OpenSourceIcon from '../src/assets/icons/open_source';
import TrendingIcon from '../src/assets/icons/trending_icon';
import FeaturedIcon from '../src/assets/icons/featured_icon';
import StarIcon from '../src/assets/icons/star_icon';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectFilter: (filterId: string) => void;
  onSelectCategory: (categoryId: string) => void;
  selectedFilter: string;
  selectedCategory: string;
}

const { width } = Dimensions.get('window');

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onSelectFilter,
  onSelectCategory,
  selectedFilter,
  selectedCategory,
}) => {
  const theme = useTheme();
  const isDarkMode = useIsDarkMode();
  const styles = createStyles(theme);

    // Dynamic icon rendering functions
  const getCategoryIcon = (categoryId: string, isSelected: boolean) => {
    const iconColor = isSelected ? theme.primary : theme.text;
    const iconSize = 22;
    
    switch (categoryId) {
      case 'All':
        return <CoursesIcon width={iconSize} height={iconSize} fill={iconColor} />;
      case 'Developers':
        return <DeveloperIcon width={iconSize} height={iconSize} fill={iconColor} />;
      case 'Video Editing':
        return <VideoEditingIcon width={iconSize} height={iconSize} fill={iconColor} />;
      case 'Photo Editing':
        return <PhotoEditIcon width={iconSize} height={iconSize} fill={iconColor} />;
      case 'Content Writing':
        return <ContentWritingIcon width={iconSize} height={iconSize} fill={iconColor} />;
      case 'Prompt Engineering':
        return <PromptIcon width={iconSize} height={iconSize} fill={iconColor} />;
      default:
        return <CoursesIcon width={iconSize} height={iconSize} fill={iconColor} />;
    }
  };

  // Configure icon sizes (you can modify these values)
const ICON_SIZES = {
  category: 22,        // Category icons size
  filter: 20,          // Filter icons size
  checkmark: 18,       // Checkmark icons size
  small: 16,           // Small icons
  medium: 20,          // Medium icons
  large: 24,           // Large icons
};


  const getFilterIcon = (filterId: string, isSelected: boolean) => {
    const iconColor = isSelected ? theme.primary : theme.text;
    const iconSize = 20;
    
    switch (filterId) {
      case 'All':
        return <CoursesIcon width={iconSize} height={iconSize} fill={iconColor} />;
      case 'Premium':
        return <PremiumIcon width={iconSize} height={iconSize} fill={iconColor} />;
      case 'Free':
        return <OpenSourceIcon width={iconSize} height={iconSize} fill={iconColor} />;
      case 'Trending':
        return <TrendingIcon width={iconSize} height={iconSize} fill={iconColor} />;
      case 'Featured':
        return <FeaturedIcon width={iconSize} height={iconSize} fill={iconColor} />;
      case 'Top Rated':
        return <StarIcon width={iconSize} height={iconSize} fill={iconColor} />;
      default:
        return <CoursesIcon width={iconSize} height={iconSize} fill={iconColor} />;
    }
  };


 const categories = [
    { 
      id: 'All', 
      name: 'All Categories', 
      icon: <CoursesIcon width={22} height={22} fill={theme.text} />, 
      count: 8 
    },
    { 
      id: 'Developers', 
      name: 'Developers', 
      icon: <DeveloperIcon width={22} height={22} fill={theme.text} />, 
      count: 2 
    },
    { 
      id: 'Video Editing', 
      name: 'Video Editing', 
      icon: <VideoEditingIcon width={22} height={22} fill={theme.text} />, 
      count: 2 
    },
    { 
      id: 'Photo Editing', 
      name: 'Photo Editing', 
      icon: <PhotoEditIcon width={22} height={22} fill={theme.text} />, 
      count: 1 
    },
    { 
      id: 'Content Writing', 
      name: 'Content Writing', 
      icon: <ContentWritingIcon width={22} height={22} fill={theme.text} />, 
      count: 1 
    },
    { 
      id: 'Prompt Engineering', 
      name: 'Prompt Engineering', 
      icon: <PromptIcon width={22} height={22} fill={theme.text} />, 
      count: 2 
    },
  ];

  const filters = [
    { 
      id: 'All', 
      name: 'All Courses', 
      icon: <CoursesIcon width={20} height={20} fill={theme.text} />, 
      description: 'Show all available courses' 
    },
    { 
      id: 'Premium', 
      name: 'Premium', 
      icon: <PremiumIcon width={20} height={20} fill={theme.text} />, 
      description: 'Premium content only' 
    },
    { 
      id: 'Free', 
      name: 'Free', 
      icon: <OpenSourceIcon width={20} height={20} fill={theme.text} />, 
      description: 'Free courses only' 
    },
    { 
      id: 'Trending', 
      name: 'Trending', 
      icon: <TrendingIcon width={20} height={20} fill={theme.text} />, 
      description: 'Popular right now' 
    },
    { 
      id: 'Featured', 
      name: 'Featured', 
      icon: <FeaturedIcon width={20} height={20} fill={theme.text} />, 
      description: 'Editor\'s choice' 
    },
    { 
      id: 'Top Rated', 
      name: 'Top Rated', 
      icon: <StarIcon width={20} height={20} fill={theme.text} />, 
      description: 'Highest rated (4.5+)' 
    },
  ];


  const renderCategoryItem = ({ item }: { item: any }) => {
    const isSelected = selectedCategory === item.id;
    
    return (
      <TouchableOpacity
        style={[
          styles.categoryItem,
          isSelected && styles.selectedCategoryItem
        ]}
        onPress={() => onSelectCategory(item.id)}
      >
        <View style={styles.categoryContent}>
          <View style={styles.categoryIcon}>
            {getCategoryIcon(item.id, isSelected)}
          </View>
          <View style={styles.categoryTextContainer}>
            <Text style={[
              styles.categoryName,
              isSelected && styles.selectedCategoryText
            ]}>
              {item.name}
            </Text>
            <Text style={styles.categoryCount}>{item.count} courses</Text>
          </View>
        </View>
        {isSelected && (
          <View style={styles.checkIconContainer}>
            <StarIcon width={18} height={18} fill={theme.primary} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

const renderFilterItem = ({ item }: { item: any }) => {
    const isSelected = selectedFilter === item.id;
    
    return (
      <TouchableOpacity
        style={[
          styles.filterItem,
          isSelected && styles.selectedFilterItem
        ]}
        onPress={() => onSelectFilter(item.id)}
      >
        <View style={styles.filterContent}>
          <View style={styles.filterIcon}>
            {getFilterIcon(item.id, isSelected)}
          </View>
          <View style={styles.filterTextContainer}>
            <Text style={[
              styles.filterName,
              isSelected && styles.selectedFilterText
            ]}>
              {item.name}
            </Text>
            <Text style={styles.filterDescription}>{item.description}</Text>
          </View>
        </View>
        {isSelected && (
          <View style={styles.checkIconContainer}>
            <StarIcon width={18} height={18} fill={theme.primary} />
          </View>
        )}
      </TouchableOpacity>
    );
  };


  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Filter & Categories</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <FlatList
              data={categories}
              renderItem={renderCategoryItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              style={styles.categoryList}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Filters</Text>
            <FlatList
              data={filters}
              renderItem={renderFilterItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              style={styles.filterList}
            />
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => {
                onSelectCategory('All');
                onSelectFilter('All');
              }}
            >
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={onClose}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.modalOverlay || 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.surface || '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    minHeight: '70%',
    shadowColor: theme.shadow || '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border || '#e9ecef',
    backgroundColor: theme.surface || '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text || '#212529',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.filterButtonBackground || '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border || '#e9ecef',
  },
  closeButtonText: {
    fontSize: 16,
    color: theme.textSecondary || '#6c757d',
    fontWeight: 'bold',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text || '#212529',
    marginBottom: 12,
  },
  categoryList: {
    maxHeight: 200,
  },
  filterList: {
    maxHeight: 250,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: theme.cardBackground || '#f8f9fa',
    borderWidth: 1,
    borderColor: theme.border || '#e9ecef',
    shadowColor: theme.shadow || '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedCategoryItem: {
    backgroundColor: theme.selected || '#e3f2fd',
    borderColor: theme.primary || '#007bff',
    borderWidth: 2,
    shadowColor: theme.primary || '#007bff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
 categoryIcon: {
    marginRight: 14,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryTextContainer: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.text || '#212529',
    marginBottom: 2,
  },
  selectedCategoryText: {
    color: theme.primary || '#007bff',
    fontWeight: '600',
  },
  categoryCount: {
    fontSize: 13,
    color: theme.textSecondary || '#6c757d',
    fontWeight: '400',
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: theme.cardBackground || '#f8f9fa',
    borderWidth: 1,
    borderColor: theme.border || '#e9ecef',
    shadowColor: theme.shadow || '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedFilterItem: {
    backgroundColor: theme.selected || '#e3f2fd',
    borderColor: theme.primary || '#007bff',
    borderWidth: 2,
    shadowColor: theme.primary || '#007bff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
   filterIcon: {
    marginRight: 14,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterTextContainer: {
    flex: 1,
  },
  filterName: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.text || '#212529',
    marginBottom: 2,
  },
  selectedFilterText: {
    color: theme.primary || '#007bff',
    fontWeight: '600',
  },
  filterDescription: {
    fontSize: 13,
    color: theme.textSecondary || '#6c757d',
    fontWeight: '400',
  },
   checkIconContainer: {
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: {
    fontSize: 18,
    color: theme.primary || '#007bff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 24,
    gap: 12,
    backgroundColor: theme.surface || '#ffffff',
    borderTopWidth: 1,
    borderTopColor: theme.border || '#e9ecef',
  },
  clearButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.textSecondary || '#6c757d',
    alignItems: 'center',
    backgroundColor: theme.surface || '#ffffff',
    shadowColor: theme.shadow || '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  clearButtonText: {
    fontSize: 16,
    color: theme.textSecondary || '#6c757d',
    fontWeight: '500',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: theme.primary || '#007bff',
    shadowColor: theme.primary || '#007bff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  applyButtonText: {
    fontSize: 16,
    color: theme.textOnPrimary || '#ffffff',
    fontWeight: '600',
  },
});

export default FilterModal;