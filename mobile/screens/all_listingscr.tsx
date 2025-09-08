import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
  Linking,
  Alert,
  StatusBar,
  TextInput,
  useColorScheme
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AITool } from '../aitypes/ai_type';
import { aiToolsData } from '../data/ai_toolsData';
import AIDetailScreen from '../components/aidetails';
import AICard from '../components/aicard';
import Button from '../components/buttons';
import FilterButton from '../components/filterbtn';
import CategoryModal from '../components/category_modal';
import { useTheme, useIsDarkMode } from '../themes/colors';

const { width } = Dimensions.get('window');

const AIListingScreen: React.FC = () => {
  const [selectedAI, setSelectedAI] = useState<AITool | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showDetailScreen, setShowDetailScreen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPricing, setSelectedPricing] = useState('all');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showTrending, setShowTrending] = useState(false);

  const theme = useTheme();
  const isDarkMode = useIsDarkMode();
  const styles = createStyles(theme);

// ... existing code ...

  // Filter and search logic
  const filteredData = useMemo(() => {
    let filtered = aiToolsData;

    // Apply search filter
    if (searchText.trim()) {
      filtered = filtered.filter(tool =>
        tool.name.toLowerCase().includes(searchText.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchText.toLowerCase()) ||
        tool.tags?.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()))
      );
    }

    // Apply trending filter
    if (showTrending) {
      filtered = filtered.filter(tool => tool.isTrending);
    }

       // Apply category filter
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'trending') {
        filtered = filtered.filter(tool => tool.isTrending);
      } else if (selectedCategory === 'highest_rated') {
        filtered = filtered.filter(tool => tool.rating >= 4.5);
      } else {
        const categoryMap: { [key: string]: string } = {
          'conversational': 'Conversational AI',
          'image': 'Image Generation',
          'development': 'Development',
          'audio': 'Audio Generation',
          'video': 'Video Generation',
          'productivity': 'Productivity',
        };
        const categoryName = categoryMap[selectedCategory];
        if (categoryName) {
          filtered = filtered.filter(tool => tool.category === categoryName);
        }
      }
    }


    // Apply pricing filter
    if (selectedPricing !== 'all') {
      if (selectedPricing === 'opensource') {
        filtered = filtered.filter(tool => tool.isOpenSource);
      } else {
        const pricingMap: { [key: string]: string } = {
          'free': 'Free',
          'freemium': 'Freemium',
          'paid': 'Paid',
        };
        const pricingValue = pricingMap[selectedPricing];
        if (pricingValue) {
          filtered = filtered.filter(tool => tool.pricing === pricingValue);
        }
      }
    }

    return filtered;
  }, [searchText, selectedCategory, selectedPricing, showTrending]);

  // Handler functions
  const handleCardPress = (aiTool: AITool) => {
    setSelectedAI(aiTool);
    setModalVisible(true);
  };

  const handleViewDetail = () => {
    setModalVisible(false);
    setShowDetailScreen(true);
  };

  const handleBackFromDetail = () => {
    setShowDetailScreen(false);
    setSelectedAI(null);
  };

  const handleVisitExternal = async () => {
    if (!selectedAI?.externalUrl) {
      Alert.alert('Error', 'No URL available for this AI tool');
      setModalVisible(false);
      return;
    }

    try {
      console.log('Opening URL:', selectedAI.externalUrl);
      await Linking.openURL(selectedAI.externalUrl);
      console.log('URL opened successfully');
    } catch (error) {
      console.error('Error opening URL:', error);
      Alert.alert(
        'Cannot Open Link',
        `Unable to open ${selectedAI.name} website. Please make sure you have a browser app installed.`
      );
    }
    
    setModalVisible(false);
  };

  const handleSave = (item: AITool) => {
    Alert.alert('Saved', `${item.name} has been saved to your favorites`);
  };

  const handleTrendingPress = () => {
    console.log('Trending button pressed, current state:', showTrending);
    setShowTrending(!showTrending);
    setSelectedCategory('all'); // Reset category when toggling trending
  };

  const handleCategoryPress = () => {
    console.log('Categories button pressed');
    setShowCategoryModal(true);
  };

  const handleSelectCategory = (categoryId: string) => {
    console.log('Category selected:', categoryId);
    setSelectedCategory(categoryId);
    setShowTrending(false); // Reset trending when selecting category
  };

  const handleSelectPricing = (pricingId: string) => {
    console.log('Pricing selected:', pricingId);
    setSelectedPricing(pricingId);
  };

  const renderAICard = ({ item }: { item: AITool }) => (
    <View style={styles.cardContainer}>
      <AICard
        aiTool={item}
        onPress={() => handleCardPress(item)}
        onSave={() => handleSave(item)}
      />
      {item.isTrending && (
        <View style={styles.trendingBadge}>
          <Text style={styles.trendingText}>🔥 Trending</Text>
        </View>
      )}
      {item.isOpenSource && (
        <View style={styles.openSourceBadge}>
          <Text style={styles.openSourceText}>🔓 Open Source</Text>
        </View>
      )}
      {item.rating && (
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>⭐ {item.rating}</Text>
        </View>
      )}
    </View>
  );

    // Get current filter display
  const getFilterDisplay = () => {
    const filters = [];
    if (showTrending) filters.push('Trending');
    if (selectedCategory !== 'all') {
      const categoryName = selectedCategory === 'trending' ? 'Trending' : 
        selectedCategory === 'highest_rated' ? 'Highest Rated' :
        selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);
      filters.push(categoryName);
    }
    if (selectedPricing !== 'all') {
      filters.push(selectedPricing.charAt(0).toUpperCase() + selectedPricing.slice(1));
    }
    return filters.length > 0 ? filters.join(', ') : 'All Tools';
  };


  if (showDetailScreen && selectedAI) {
    return (
      <AIDetailScreen
        aiTool={selectedAI}
        onBack={handleBackFromDetail}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={theme.surface} 
      />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Tools</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search AI Tools"
            placeholderTextColor={theme.textSecondary}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* Saved Tools Section */}
      <TouchableOpacity style={styles.savedSection}>
        <Text style={styles.bookmarkIcon}>🔖</Text>
        <Text style={styles.savedText}>Your Saved AI Tools</Text>
      </TouchableOpacity>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <FilterButton
          title="Trending"
          icon="🔥"
          isActive={showTrending}
          onPress={handleTrendingPress}
        />
        <FilterButton
          title="Categories"
          hasDropdown={true}
          isActive={selectedCategory !== 'all' || selectedPricing !== 'all'}
          onPress={handleCategoryPress}
        />
      </View>

      {/* Active Filters Display */}
      {(selectedCategory !== 'all' || selectedPricing !== 'all' || showTrending) && (
        <View style={styles.activeFiltersContainer}>
          <Text style={styles.activeFiltersText}>
            Showing: {getFilterDisplay()} ({filteredData.length} tools)
          </Text>
          <TouchableOpacity
            onPress={() => {
              setSelectedCategory('all');
              setSelectedPricing('all');
              setShowTrending(false);
            }}
            style={styles.clearFiltersButton}
          >
            <Text style={styles.clearFiltersText}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* AI Tools Grid */}
      <FlatList
        data={filteredData}
        renderItem={renderAICard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={filteredData.length > 1 ? styles.row : null}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No AI tools found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your filters or search terms</Text>
          </View>
        }
      />

      {/* Options Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedAI?.name}</Text>
            
            <Button
              title="View Details"
              variant="primary"
              onPress={handleViewDetail}
              style={styles.modalButton}
            />

            <Button
              title="Visit in Browser"
              variant="primary"
              onPress={handleVisitExternal}
              style={styles.modalButton}
            />

            <Button
              title="Cancel"
              variant="outline"
              onPress={() => setModalVisible(false)}
              style={styles.modalButton}
            />
          </View>
        </View>
      </Modal>

      {/* Category Modal */}
      <CategoryModal
        visible={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onSelectCategory={handleSelectCategory}
        onSelectPricing={handleSelectPricing}
        selectedCategory={selectedCategory}
        selectedPricing={selectedPricing}
      />

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>▶️</Text>
          <Text style={styles.navText}>Courses</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.activeNavItem]}>
          <Text style={styles.navIcon}>🤖</Text>
          <Text style={[styles.navText, styles.activeNavText]}>AI Tools</Text>
          <View style={styles.activeDot} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: theme.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  backButton: {
    width: 40,
  },
  backArrow: {
    fontSize: 24,
    color: theme.text,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text,
  },
  placeholder: {
    width: 40,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.searchBackground,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: theme.border,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
    color: theme.textSecondary,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.text,
  },
  savedSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.savedSectionBackground,
    marginHorizontal: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  bookmarkIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  savedText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.savedSectionBackground === '#00d66a' ? '#000000' : theme.primary,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 15,
  },
  cardContainer: {
    position: 'relative',
    width: (width - 30) / 2,
    marginBottom: 20,
  },
  trendingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ff4757',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    zIndex: 1,
  },
  trendingText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  openSourceBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#2ed573',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    zIndex: 1,
  },
  openSourceText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  ratingContainer: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    zIndex: 1,
  },
  ratingText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  activeFiltersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: theme.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    marginBottom: 10,
  },
  activeFiltersText: {
    fontSize: 14,
    color: theme.textSecondary,
    flex: 1,
  },
  clearFiltersButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: theme.primary,
  },
  clearFiltersText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.modalOverlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.surface,
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 300,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: theme.text,
  },
  modalButton: {
    marginBottom: 10,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: theme.bottomNavBackground,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: theme.border,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
    position: 'relative',
  },
  activeNavItem: {
    // Active item styling
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  navText: {
    fontSize: 12,
    color: theme.textSecondary,
  },
  activeNavText: {
    color: theme.accent,
    fontWeight: '600',
  },
  activeDot: {
    position: 'absolute',
    top: -5,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.accent,
  },
});

export default AIListingScreen;