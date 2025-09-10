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
  useColorScheme,
  Share
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AITool } from '../aitypes/ai_type';
import AIDetailScreen from '../components/aidetails';
import AICard from '../components/aicard';
import Button from '../components/buttons';
import FilterButton from '../components/filterbtn';
import CategoryModal from '../components/category_modal';
import SortModal, { SortOption } from '../components/SortModal';
import { useTheme, useIsDarkMode } from '../themes/colors';

const { width } = Dimensions.get('window');

// Calculate card width for 3-column grid layout
const cardWidth = (width - 60) / 3; // Following the memory pattern for 3-item layout

interface SavedAIToolsScreenProps {
  onBack?: () => void;
}

const SavedAIToolsScreen: React.FC<SavedAIToolsScreenProps> = ({ onBack }) => {
  const [savedAITools, setSavedAITools] = useState<AITool[]>([
    // Demo saved tools - in a real app this would come from AsyncStorage or a database
    {
      id: '1',
      name: 'ChatGPT',
      description: 'Advanced conversational AI that can help with writing, coding, analysis, and creative tasks.',
      image: 'https://via.placeholder.com/100x100/4A90E2/FFFFFF?text=GPT',
      externalUrl: 'https://chatgpt.com',
      category: 'Conversational AI',
      subcategory: 'Text Generation',
      pricing: 'Freemium',
      rating: 4.8,
      isOpenSource: false,
      isTrending: true,
      tags: ['Writing', 'Coding', 'Analysis']
    },
    {
      id: '4',
      name: 'Stable Diffusion',
      description: 'Open-source deep learning text-to-image model for creating detailed images.',
      image: 'https://via.placeholder.com/100x100/8E44AD/FFFFFF?text=SD',
      externalUrl: 'https://stability.ai/stable-diffusion',
      category: 'Image Generation',
      subcategory: 'Art Creation',
      pricing: 'Open Source',
      rating: 4.5,
      isOpenSource: true,
      isTrending: false,
      tags: ['Open Source', 'Art', 'Free']
    },
    {
      id: '10',
      name: 'Hugging Face',
      description: 'Open-source platform for machine learning models and datasets.',
      image: 'https://via.placeholder.com/100x100/FF9500/FFFFFF?text=HF',
      externalUrl: 'https://huggingface.co',
      category: 'Development',
      subcategory: 'ML Platform',
      pricing: 'Open Source',
      rating: 4.7,
      isOpenSource: true,
      isTrending: false,
      tags: ['Open Source', 'ML', 'Models']
    },
    {
      id: '11',
      name: 'Hugging Face',
      description: 'Open-source platform for machine learning models and datasets.',
      image: 'https://via.placeholder.com/100x100/FF9500/FFFFFF?text=HF',
      externalUrl: 'https://huggingface.co',
      category: 'Development',
      subcategory: 'ML Platform',
      pricing: 'Open Source',
      rating: 4.7,
      isOpenSource: true,
      isTrending: false,
      tags: ['Open Source', 'ML', 'Models']
    }

  ]);

  const [selectedAI, setSelectedAI] = useState<AITool | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showDetailScreen, setShowDetailScreen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPricing, setSelectedPricing] = useState('all');
   const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [viewLayout, setViewLayout] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('dateAdded');
  const [showSortModal, setShowSortModal] = useState(false);

  const theme = useTheme();
  const isDarkMode = useIsDarkMode();
  const styles = createStyles(theme, isDarkMode);

  // Filter and search logic for saved tools
 const filteredData = useMemo(() => {
    let filtered = [...savedAITools];

    // Apply search filter
    if (searchText.trim()) {
      filtered = filtered.filter(tool =>
        tool.name.toLowerCase().includes(searchText.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchText.toLowerCase()) ||
        tool.tags?.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()))
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'highest_rated') {
        filtered = filtered.filter(tool => tool.rating && tool.rating >= 4.5);
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

     // Apply sorting
    if (selectedCategory === 'highest_rated') {
      filtered = filtered.filter(tool => tool.rating && tool.rating >= 4.5)
        .sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else {
      // Apply other sorting
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'rating':
            return (b.rating || 0) - (a.rating || 0);
          case 'category':
            return a.category.localeCompare(b.category);
          case 'trending':
            if (a.isTrending && !b.isTrending) return -1;
            if (!a.isTrending && b.isTrending) return 1;
            return (b.rating || 0) - (a.rating || 0); // Secondary sort by rating
          case 'dateAdded':
          default:
            return parseInt(b.id) - parseInt(a.id); // Newest first
        }
      });
    }

    return filtered;
  }, [searchText, selectedCategory, selectedPricing, sortBy, savedAITools]);

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

  const handleRemoveFromSaved = (item: AITool) => {
    Alert.alert(
      'Remove from Saved',
      `Are you sure you want to remove ${item.name} from your saved tools?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setSavedAITools(prev => prev.filter(tool => tool.id !== item.id));
            Alert.alert('Removed', `${item.name} has been removed from your saved tools`);
          },
        },
      ]
    );
  };

  const handleSortPress = () => {
    setShowSortModal(true);
  };

 
   const handleSelectSort = (sortOption: SortOption) => {
    setSortBy(sortOption);
  };

  const handleShareTool = async (item: AITool) => {
    try {
      const shareMessage = `🤖 Check out ${item.name}! 

${item.description}

⭐ Rating: ${item.rating}/5
🔗 Link: ${item.externalUrl}

🚀 Discover this and 100+ other amazing AI tools on OrbLoop - Everything AI!

Choose from our curated collection of the best AI tools for productivity, creativity, development, and more. Download now and explore the future of AI! `;

      const result = await Share.share({
        message: shareMessage,
        url: item.externalUrl,
        title: `${item.name} - AI Tool from OrbLoop`,
      });

      if (result.action === Share.sharedAction) {
        console.log('Tool shared successfully:', item.name);
      }
    } catch (error) {
      console.error('Error sharing tool:', error);
      Alert.alert('Share Error', 'Unable to share this AI tool. Please try again.');
    }
  };


  const handleCategoryPress = () => {
    setShowCategoryModal(true);
  };

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleSelectPricing = (pricingId: string) => {
    setSelectedPricing(pricingId);
  };

  const handleClearAll = () => {
    if (savedAITools.length === 0) return;
    
    Alert.alert(
      'Clear All Saved Tools',
      'Are you sure you want to remove all saved AI tools? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            setSavedAITools([]);
            Alert.alert('Cleared', 'All saved tools have been removed');
          },
        },
      ]
    );
  };

 const renderAICard = ({ item }: { item: AITool }) => (
    <View style={[
      styles.cardContainer,
      viewLayout === 'grid' && { width: cardWidth }
    ]}>
      <AICard
        aiTool={item}
        onPress={() => handleCardPress(item)}
        onSave={() => handleRemoveFromSaved(item)}
        onShare={() => handleShareTool(item)}
        isSaved={true}
        layout={viewLayout}
      />
      {item.isOpenSource && (
        <View style={styles.openSourceBadge}>
          <Text style={styles.openSourceText}>🔓 Open Source</Text>
        </View>
      )}
      {item.isTrending && (
        <View style={[
          styles.trendingBadge,
          item.isOpenSource && { top: 40 } // Stack below open source badge if both present
        ]}>
          <Text style={styles.trendingText}>🔥 Trending</Text>
        </View>
      )}
    </View>
  );

  const getSortIcon = () => {
    switch (sortBy) {
      case 'name': return '🔤';
      case 'rating': return '⭐';
      case 'category': return '📁';
      case 'dateAdded': return '📅';
      default: return '📅';
    }
  };

  const getFilterDisplay = () => {
    const filters = [];
    if (selectedCategory !== 'all') {
      const categoryName = selectedCategory === 'highest_rated' ? 'Highest Rated' :
        selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);
      filters.push(categoryName);
    }
    if (selectedPricing !== 'all') {
      filters.push(selectedPricing.charAt(0).toUpperCase() + selectedPricing.slice(1));
    }
    return filters.length > 0 ? filters.join(', ') : 'All Saved Tools';
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
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved AI Tools</Text>
        <TouchableOpacity style={styles.clearButton} onPress={handleClearAll}>
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{savedAITools.length}</Text>
          <Text style={styles.statLabel}>Saved Tools</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{savedAITools.filter(tool => tool.isOpenSource).length}</Text>
          <Text style={styles.statLabel}>Open Source</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{savedAITools.filter(tool => tool.rating >= 4.5).length}</Text>
          <Text style={styles.statLabel}>High Rated</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search saved tools"
            placeholderTextColor={theme.textSecondary}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* Filter and Sort Section */}
      <View style={styles.controlsContainer}>
        <View style={styles.filterContainer}>
          <FilterButton
            title="Categories"
            icon="📁"
            isActive={selectedCategory !== 'all'}
            onPress={handleCategoryPress}
          />
          <TouchableOpacity 
            style={[styles.sortButton, sortBy !== 'dateAdded' && styles.sortButtonActive]}
            onPress={handleSortPress}
          >
            <Text style={styles.sortIcon}>{getSortIcon()}</Text>
            <Text style={styles.sortText}>Sort</Text>
          </TouchableOpacity>
        </View>
        
        {/* Active filters display */}
        {(selectedCategory !== 'all' || selectedPricing !== 'all') && (
          <View style={styles.activeFiltersContainer}>
            <Text style={styles.activeFiltersText}>Filters: {getFilterDisplay()}</Text>
            <TouchableOpacity 
              onPress={() => {
                setSelectedCategory('all');
                setSelectedPricing('all');
              }}
              style={styles.clearFiltersButton}
            >
              <Text style={styles.clearFiltersText}>Clear</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* AI Tools List */}
      {savedAITools.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📱</Text>
          <Text style={styles.emptyTitle}>No Saved AI Tools</Text>
          <Text style={styles.emptyDescription}>
            Start exploring AI tools and save your favorites to see them here.
          </Text>
          {onBack && (
            <Button
              title="Explore AI Tools"
              variant="primary"
              onPress={onBack}
              style={styles.exploreButton}
            />
          )}
        </View>
      ) : filteredData.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyTitle}>No Results Found</Text>
          <Text style={styles.emptyDescription}>
            Try adjusting your search or filters to find what you're looking for.
          </Text>
        </View>
      ) : (
          <FlatList
          data={filteredData}
          renderItem={renderAICard}
          keyExtractor={(item) => item.id}
          numColumns={viewLayout === 'list' ? 1 : 3}
          key={viewLayout} // Force re-render when layout changes
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={viewLayout === 'list' ? undefined : styles.row}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Detail Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedAI && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedAI.name}</Text>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={styles.closeButton}
                  >
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.modalDescription}>{selectedAI.description}</Text>
                <View style={styles.modalActions}>
                  <Button
                    title="View Details"
                    variant="outline"
                    onPress={handleViewDetail}
                    style={styles.modalButton}
                  />
                  <Button
                    title="Visit Website"
                    variant="primary"
                    onPress={handleVisitExternal}
                    style={styles.modalButton}
                  />
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Category Modal */}
      <CategoryModal
        visible={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        selectedCategory={selectedCategory}
        selectedPricing={selectedPricing}
        onSelectCategory={handleSelectCategory}
        onSelectPricing={handleSelectPricing}
      />

       {/* Sort Modal */}
      <SortModal
        visible={showSortModal}
        onClose={() => setShowSortModal(false)}
        selectedSort={sortBy}
        onSelectSort={handleSelectSort}
      />
    </SafeAreaView>
  );
};

const createStyles = (theme: any, isDarkMode?: boolean) => StyleSheet.create({
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
    height: 40,
    borderRadius: 20,
    backgroundColor: isDarkMode ? '#00ff88' : theme.filterButtonBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 18,
    color: isDarkMode ? '#000000' : theme.text,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: theme.error + '20',
  },
  clearButtonText: {
    color: theme.error,
    fontSize: 12,
    fontWeight: '600',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: theme.filterButtonBackground,
    borderWidth: 1,
    borderColor: theme.border,
  },
 sortButtonActive: {
    backgroundColor: isDarkMode ? '#00ff88' : theme.primary + '20',
    borderColor: isDarkMode ? '#00ff88' : theme.primary,
  },
  layoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: theme.filterButtonBackground,
    borderWidth: 1,
    borderColor: theme.border,
  },
  filterButton: {
    backgroundColor: theme.categoryTabInactive,
    borderColor: theme.border,
  },
  filterButtonText: {
    color: theme.text,
  },
  selectedCategoryItem: {
    backgroundColor: theme.selected,
    borderColor: theme.primary,
    borderWidth: 2,
  },
  modalButtonText: {
    color: theme.primary,
  },
trendingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ff4757',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  trendingText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  openSourceBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#2ed573',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  openSourceText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  ratingContainer: {
    backgroundColor: theme.ratingBackground,
  },
  ratingText: {
    color: theme.textOnPrimary,
  },
  clearAllButton: {
    backgroundColor: theme.borderLight,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: theme.surface,
    marginBottom: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.primary,
  },
  statLabel: {
    fontSize: 12,
    color: theme.textSecondary,
    marginTop: 4,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.searchBackground,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: theme.border,
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
  controlsContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sortIcon: {
    fontSize: 14,
    marginRight: 5,
  },
  sortText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.text,
  },
  activeFiltersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: theme.primary + '10',
    borderRadius: 15,
  },
  activeFiltersText: {
    fontSize: 12,
    color: theme.primary,
    fontWeight: '600',
  },
  clearFiltersButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: isDarkMode ? '#00ff88' : 'transparent',
    borderRadius: 6,
  },
  clearFiltersText: {
    fontSize: 12,
    color: isDarkMode ? '#000000' : theme.primary,
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  cardContainer: {
    position: 'relative',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    color: theme.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  exploreButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.modalOverlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.surface,
    borderRadius: 20,
    padding: 20,
    width: width - 40,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
    flex: 1,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: isDarkMode ? '#333333' : theme.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: theme.textSecondary,
  },
  modalDescription: {
    fontSize: 14,
    color: theme.textSecondary,
    lineHeight: 20,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
  },
  modalButton: {
    backgroundColor: theme.surface,
    borderColor: theme.border,
  },
});

export default SavedAIToolsScreen;