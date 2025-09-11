// components/CourseCategoryModal.tsx
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

interface CourseCategoryModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectCategory: (categoryId: string) => void;
  onSelectFilter: (filterId: string) => void;
  selectedCategory: string;
  selectedFilter: string;
}

const { width } = Dimensions.get('window');

const CourseCategoryModal: React.FC<CourseCategoryModalProps> = ({
  visible,
  onClose,
  onSelectCategory,
  onSelectFilter,
  selectedCategory,
  selectedFilter,
}) => {
  const theme = useTheme();
  const isDarkMode = useIsDarkMode();
  const styles = createStyles(theme);

  const categories = [
    { id: 'All', name: 'All Categories', icon: '📚', count: 7 },
    { id: 'Developers', name: 'Developers', icon: '💻', count: 2 },
    { id: 'Video Editing', name: 'Video Editing', icon: '🎬', count: 2 },
    { id: 'Photo Editing', name: 'Photo Editing', icon: '📸', count: 1 },
    { id: 'Content Writing', name: 'Content Writing', icon: '✍️', count: 1 },
    { id: 'Prompt Engineering', name: 'Prompt Engineering', icon: '🔗', count: 1 },
  ];

  const filters = [
    { id: 'All', name: 'All Courses', icon: '📋', description: 'Show all available courses' },
    { id: 'Premium', name: 'Premium', icon: '💎', description: 'Premium content only' },
    { id: 'Free', name: 'Free', icon: '🆓', description: 'Free courses only' },
    { id: 'Trending', name: 'Trending', icon: '🔥', description: 'Popular right now' },
    { id: 'Featured', name: 'Featured', icon: '⭐', description: 'Editor\'s choice' },
    { id: 'Top Rated', name: 'Top Rated', icon: '🏆', description: 'Highest rated (4.7+)' },
  ];

  const renderCategoryItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.id && styles.selectedCategoryItem
      ]}
      onPress={() => onSelectCategory(item.id)}
    >
      <View style={styles.categoryContent}>
        <Text style={styles.categoryIcon}>{item.icon}</Text>
        <View style={styles.categoryTextContainer}>
          <Text style={[
            styles.categoryName,
            selectedCategory === item.id && styles.selectedCategoryText
          ]}>
            {item.name}
          </Text>
          <Text style={styles.categoryCount}>{item.count} courses</Text>
        </View>
      </View>
      {selectedCategory === item.id && (
        <Text style={styles.checkIcon}>✓</Text>
      )}
    </TouchableOpacity>
  );

  const renderFilterItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.filterItem,
        selectedFilter === item.id && styles.selectedFilterItem
      ]}
      onPress={() => onSelectFilter(item.id)}
    >
      <View style={styles.filterContent}>
        <Text style={styles.filterIcon}>{item.icon}</Text>
        <View style={styles.filterTextContainer}>
          <Text style={[
            styles.filterName,
            selectedFilter === item.id && styles.selectedFilterText
          ]}>
            {item.name}
          </Text>
          <Text style={styles.filterDescription}>{item.description}</Text>
        </View>
      </View>
      {selectedFilter === item.id && (
        <Text style={styles.checkIcon}>✓</Text>
      )}
    </TouchableOpacity>
  );

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
            <Text style={styles.headerTitle}>Course Categories & Filters</Text>
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
    fontSize: 22,
    marginRight: 14,
    width: 30,
    textAlign: 'center',
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
    fontSize: 20,
    marginRight: 14,
    width: 30,
    textAlign: 'center',
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

export default CourseCategoryModal;