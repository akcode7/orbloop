// components/CategoryModal.tsx
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
import { categories, pricingFilters } from '../data/ai_toolsData';

interface CategoryModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectCategory: (categoryId: string) => void;
  onSelectPricing: (pricingId: string) => void;
  selectedCategory: string;
  selectedPricing: string;
}

const { width } = Dimensions.get('window');

const CategoryModal: React.FC<CategoryModalProps> = ({
  visible,
  onClose,
  onSelectCategory,
  onSelectPricing,
  selectedCategory,
  selectedPricing,
}) => {
  const theme = {
    background: '#ffffff',
    surface: '#f8f9fa',
    primary: '#007bff',
    text: '#212529',
    textSecondary: '#6c757d',
    border: '#e9ecef',
    modalOverlay: 'rgba(0, 0, 0, 0.5)',
  };

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
          <Text style={styles.categoryCount}>{item.count} tools</Text>
        </View>
      </View>
      {selectedCategory === item.id && (
        <Text style={styles.checkIcon}>✓</Text>
      )}
    </TouchableOpacity>
  );

  const renderPricingItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.pricingItem,
        selectedPricing === item.id && styles.selectedPricingItem
      ]}
      onPress={() => onSelectPricing(item.id)}
    >
      <Text style={styles.pricingIcon}>{item.icon}</Text>
      <Text style={[
        styles.pricingName,
        selectedPricing === item.id && styles.selectedPricingText
      ]}>
        {item.name}
      </Text>
      {selectedPricing === item.id && (
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
            <Text style={styles.sectionTitle}>Pricing</Text>
            <FlatList
              data={pricingFilters}
              renderItem={renderPricingItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.pricingList}
            />
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => {
                onSelectCategory('all');
                onSelectPricing('all');
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

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    minHeight: '60%',
    shadowColor: '#000',
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
    borderBottomColor: '#e9ecef',
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: 'bold',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 12,
  },
  categoryList: {
    maxHeight: 220,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedCategoryItem: {
    backgroundColor: '#e3f2fd',
    borderColor: '#007bff',
    borderWidth: 2,
    shadowColor: '#007bff',
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
    color: '#212529',
    marginBottom: 2,
  },
  selectedCategoryText: {
    color: '#007bff',
    fontWeight: '600',
  },
  categoryCount: {
    fontSize: 13,
    color: '#6c757d',
    fontWeight: '400',
  },
  checkIcon: {
    fontSize: 18,
    color: '#007bff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  pricingList: {
    flexGrow: 0,
    paddingVertical: 4,
  },
  pricingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    minWidth: 110,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedPricingItem: {
    backgroundColor: '#e3f2fd',
    borderColor: '#007bff',
    borderWidth: 2,
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pricingIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  pricingName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#212529',
  },
  selectedPricingText: {
    color: '#007bff',
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 24,
    gap: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f3f4',
  },
  clearButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#6c757d',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  clearButtonText: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '500',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#007bff',
    alignItems: 'center',
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  applyButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default CategoryModal;