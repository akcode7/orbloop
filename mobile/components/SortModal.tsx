import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useTheme, useIsDarkMode } from '../themes/colors';

const { width } = Dimensions.get('window');

export type SortOption = 'name' | 'rating' | 'category' | 'dateAdded' | 'trending';

interface SortModalProps {
  visible: boolean;
  onClose: () => void;
  selectedSort: SortOption;
  onSelectSort: (sortOption: SortOption) => void;
}

const SortModal: React.FC<SortModalProps> = ({
  visible,
  onClose,
  selectedSort,
  onSelectSort,
}) => {
  const theme = useTheme();
  const isDarkMode = useIsDarkMode();
  const styles = createStyles(theme, isDarkMode);

  const sortOptions = [
    { id: 'name' as SortOption, name: 'Name (A-Z)', icon: '🔤', description: 'Alphabetical order' },
    { id: 'rating' as SortOption, name: 'Highest Rated', icon: '⭐', description: 'Best ratings first' },
    { id: 'category' as SortOption, name: 'Category', icon: '📁', description: 'Group by category' },
    { id: 'trending' as SortOption, name: 'Trending First', icon: '🔥', description: 'Most popular tools' },
    { id: 'dateAdded' as SortOption, name: 'Recently Added', icon: '📅', description: 'Newest tools first' },
  ];

  const handleSelectSort = (sortOption: SortOption) => {
    onSelectSort(sortOption);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Sort AI Tools</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.optionsContainer}>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionItem,
                  selectedSort === option.id && styles.selectedOption
                ]}
                onPress={() => handleSelectSort(option.id)}
              >
                <View style={styles.optionLeft}>
                  <Text style={styles.optionIcon}>{option.icon}</Text>
                  <View style={styles.optionTextContainer}>
                    <Text style={[
                      styles.optionTitle,
                      selectedSort === option.id && styles.selectedOptionText
                    ]}>
                      {option.name}
                    </Text>
                    <Text style={styles.optionDescription}>
                      {option.description}
                    </Text>
                  </View>
                </View>
                {selectedSort === option.id && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (theme: any, isDarkMode: boolean) => StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: theme.textSecondary,
    fontWeight: 'bold',
  },
  optionsContainer: {
    gap: 4,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: theme.cardBackground,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: isDarkMode ? '#00ff88' + '20' : theme.primary + '15',
    borderWidth: 2,
    borderColor: isDarkMode ? '#00ff88' : theme.primary,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 2,
  },
  selectedOptionText: {
    color: isDarkMode ? '#00ff88' : theme.primary,
  },
  optionDescription: {
    fontSize: 13,
    color: theme.textSecondary,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: isDarkMode ? '#00ff88' : theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default SortModal;