import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
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
import SortModal from '../components/SortModal';
import SearchIcon from '../src/assets/icons/search_icon';
import StarIcon from '../src/assets/icons/star_icon';
import BottomNavigation from '../components/bottom_navigation';
import { useTheme, useIsDarkMode } from '../themes/colors';
import SavedIcon from '../src/assets/icons/saved_icon';
import Flame from '../src/assets/icons/fire_icon';
import OpenSourceIcon from '../src/assets/icons/open_source';
import CategoriesIcon from '../src/assets/icons/categories_icon';
import SortAz from '../src/assets/icons/sort_a_toz';
import RecentIcon from '../src/assets/icons/recent_icon';
import TrendingIcon from '../src/assets/icons/trending_icon';

const { width } = Dimensions.get('window');

interface AIListingScreenProps {
  onNavigateToHome?: () => void;
  onNavigateToSaved?: () => void;
  onNavigateToSettings?: () => void;
  onNavigateToLearn?: () => void;
  
}

const AIListingScreen: React.FC<AIListingScreenProps> = ({
  onNavigateToHome,
  onNavigateToSaved,
  onNavigateToSettings,
  onNavigateToLearn,
}) => {
  const [selectedAI, setSelectedAI] = useState<AITool | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showDetailScreen, setShowDetailScreen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPricing, setSelectedPricing] = useState('all');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showTrending, setShowTrending] = useState(false);
  const [activeTab, setActiveTab] = useState('explore');
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'category' | 'dateAdded' | 'trending'>('dateAdded');
  const [showSortModal, setShowSortModal] = useState(false);

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

     // Apply sorting
    if (selectedCategory === 'highest_rated') {
      filtered = filtered.filter(tool => tool.rating >= 4.5)
        .sort((a, b) => b.rating - a.rating);
    } else {
      // Apply other sorting
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'rating':
            return b.rating - a.rating;
          case 'category':
            return a.category.localeCompare(b.category);
          case 'trending':
            if (a.isTrending && !b.isTrending) return -1;
            if (!a.isTrending && b.isTrending) return 1;
            return b.rating - a.rating; // Secondary sort by rating
          case 'dateAdded':
          default:
            return parseInt(b.id) - parseInt(a.id); // Newest first
        }
      });
    }

    return filtered;
  }, [searchText, selectedCategory, selectedPricing, showTrending, sortBy]);

  // Handler functions
  const handleCardPress = (aiTool: AITool) => {
    setSelectedAI(aiTool);
    setShowDetailScreen(true);
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

  const handleRateAI = (aiToolId: string, rating: number) => {
    console.log(`User rated AI tool ${aiToolId} with ${rating} stars`);
    // Here you could implement saving the rating to local storage or API
    // For now, we'll just log it
  };

  const handleSortPress = () => {
    setShowSortModal(true);
  };

  const handleSelectSort = (sortOption: 'name' | 'rating' | 'category' | 'dateAdded' | 'trending') => {
    setSortBy(sortOption);
  };

    const getSortIcon = () => {
    const iconSize = 14;
    const iconColor = theme.text;
    
    switch (sortBy) {
      case 'name': 
        return <SortAz width={iconSize} height={iconSize} fill={iconColor} />;
      case 'rating': 
        return <StarIcon width={iconSize} height={iconSize} fill={iconColor} />;
      case 'category': 
        return <CategoriesIcon width={iconSize} height={iconSize} fill={iconColor} />;
      case 'trending': 
        return <TrendingIcon width={iconSize} height={iconSize} fill={iconColor} />;
      case 'dateAdded': 
        return <RecentIcon width={iconSize} height={iconSize} fill={iconColor} />;
      default: 
        return <RecentIcon width={iconSize} height={iconSize} fill={iconColor} />;
    }
  };

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    switch (tab) {
      case 'home':
        if (onNavigateToHome) {
          onNavigateToHome();
        }
        break;
      case 'explore':
        // Already on explore screen
        break;
      case 'saved':
        if (onNavigateToSaved) {
          onNavigateToSaved();
        }
        break;
      case 'learn':
        if (onNavigateToLearn) {
          onNavigateToLearn();
        }
        break;
    }
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
          <View style={styles.badgeContent}>
            <Flame width={10} height={10} fill="#ffffff" />
            <Text style={styles.trendingText}> Trending</Text>
          </View>
        </View>
      )}
      {item.isOpenSource && (
        <View style={styles.openSourceBadge}>
          <View style={styles.badgeContent}>
            <OpenSourceIcon width={10} height={10} fill="#ffffff" />
            <Text style={styles.openSourceText}> Open Source</Text>
          </View>
        </View>
      )}
      {item.rating && (
        <View style={styles.ratingContainer}>
          <View style={styles.ratingContent}>
            <StarIcon width={12} height={12} fill="#FFD700" />
            <Text style={styles.ratingText}> {item.rating}</Text>
          </View>
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
        onRateAI={handleRateAI}
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
        <TouchableOpacity style={styles.backButton} onPress={onNavigateToHome}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Tools</Text>
        <View style={styles.placeholder} />
      </View>

       {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchIconContainer}>
          <SearchIcon width={16} height={16} fill={theme.textSecondary} />
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="Search AI Tools..."
          placeholderTextColor={theme.textSecondary}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Saved Tools Section */}
      <TouchableOpacity style={styles.savedSection} onPress={onNavigateToSaved}>
        <SavedIcon style={styles.customGap} width={15} height={15} fill={theme.text} />
        <Text style={styles.savedText} >Your Saved AI Tools</Text>
      </TouchableOpacity>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <FilterButton
          title="Trending"
          isActive={showTrending}
          onPress={handleTrendingPress}
        />
        <FilterButton
          title="Categories"
          hasDropdown={true}
          isActive={selectedCategory !== 'all' || selectedPricing !== 'all'}
          onPress={handleCategoryPress}
        />

        <TouchableOpacity 
          style={[styles.sortButton, sortBy !== 'dateAdded' && styles.sortButtonActive]}
          onPress={handleSortPress}
        >
          <View style={styles.sortIcon}>
            {getSortIcon()}
          </View>
          <Text style={styles.sortText}>Sort</Text>
        </TouchableOpacity>
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


      {/* Category Modal */}
       <CategoryModal
        visible={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onSelectCategory={handleSelectCategory}
        onSelectPricing={handleSelectPricing}
        selectedCategory={selectedCategory}
        selectedPricing={selectedPricing}
      />

       {/* Sort Modal */}
      <SortModal
        visible={showSortModal}
        onClose={() => setShowSortModal(false)}
        selectedSort={sortBy}
        onSelectSort={handleSelectSort}
      />

      {/* Bottom Navigation */}
      <BottomNavigation
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.cardBackground,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.border,
  },
  searchIconContainer: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.text,
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
  width: (width - 45) / 2,
  marginBottom: 20,
  },
   listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 100,
  },

  customGap:{
    paddingHorizontal: 20,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 0,
  },
  trendingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: theme.trendingBadge,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    zIndex: 1,
  },
  trendingText: {
    fontSize: 10,
    color: theme.textOnError,
    fontWeight: 'bold',
  },
  openSourceBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: theme.openSourceBadge,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    zIndex: 1,
  },
  openSourceText: {
    fontSize: 10,
    color: theme.textOnSuccess,
    fontWeight: 'bold',
  },
  ratingContainer: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: theme.ratingBackground,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    zIndex: 1,
  },
  ratingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 10,
    color: theme.textOnPrimary,
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
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: theme.cardBackground,
    borderWidth: 1,
    borderColor: theme.border,
  },
  sortButtonActive: {
    backgroundColor: theme.primary + '20',
    borderColor: theme.primary,
  },
    sortIcon: {
    marginRight: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.text,
  },
  
});

export default AIListingScreen;