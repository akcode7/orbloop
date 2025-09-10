import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  StatusBar,
  Dimensions,
  TextInput,
  Share,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AITool } from '../aitypes/ai_type';
import { aiToolsData } from '../data/ai_toolsData';
import AICard from '../components/aicard';
import BottomNavigation from '../components/bottom_navigation';
import { useTheme, useIsDarkMode } from '../themes/colors';

interface HomeScreenProps {
  onNavigateToAllListings: () => void;
  onNavigateToDetail: (tool: AITool) => void;
  onSaveTool: (tool: AITool) => void;
  onNavigateToSaved?: () => void;
  savedTools: AITool[];
  onNavigateToSearch?: () => void;
  onNavigateToProfile?: () => void;
}

const { width } = Dimensions.get('window');

const HomeScreen: React.FC<HomeScreenProps> = ({
   onNavigateToAllListings,
  onNavigateToDetail,
  onSaveTool,
  onNavigateToSaved,
  savedTools = [],
  onNavigateToSearch,
  onNavigateToProfile,
}) => {
  const theme = useTheme();
  const isDarkMode = useIsDarkMode();
 
  const styles = createStyles(theme);

  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [activeCategory, setActiveCategory] = useState('all');

  // Category data
  const categories = [
    { id: 'all', name: 'All AI Tools', icon: '🤖' },
    { id: 'productivity', name: 'Productivity', icon: '⚡' },
    { id: 'video', name: 'Video Creator', icon: '🎬' },
    { id: 'image', name: 'Image Generator', icon: '🎨' },
    { id: 'ppt', name: 'PPT Maker', icon: '📊' },
  ];

  // Filter tools based on active category
  const getFilteredTools = () => {
    if (activeCategory === 'all') return aiToolsData;
    
    const categoryMap: { [key: string]: string[] } = {
      'productivity': ['Productivity'],
      'video': ['Video Generation'],
      'image': ['Image Generation'],
      'ppt': ['Productivity'], // Assuming PPT tools are in Productivity category
    };
    
    const targetCategories = categoryMap[activeCategory] || [];
    return aiToolsData.filter(tool => 
      targetCategories.includes(tool.category) ||
      (activeCategory === 'ppt' && tool.name.toLowerCase().includes('presentation'))
    );
  };

  // Get latest releases (newest tools, could be based on date or ID)
  const latestReleases = getFilteredTools()
    .slice()
    .sort((a, b) => parseInt(b.id) - parseInt(a.id))
    .slice(0, 4);

  // Get trending tools - limit to 4 for slider effect  
  const trendingTools = getFilteredTools().filter(tool => tool.isTrending).slice(0, 4);

  // Calculate card dimensions for 3-item slider layout
  const cardWidth = (width - 60) / 3; // Screen width minus padding, divided by 3
  const snapInterval = cardWidth + 10; // Card width plus gap


  // Get highest rated tools
  const highestRated = aiToolsData
    .filter(tool => tool.rating >= 4.5)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  

  const onRefresh = () => {
    setRefreshing(true);
   
    // Simulate network refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  

  

  const isToolSaved = (tool: AITool) => {
    return savedTools.some(saved => saved.id === tool.id);
  };

  const handleCardPress = (tool: AITool) => {
    onNavigateToDetail(tool);
  };

  const handleSaveTool = (tool: AITool) => {
    onSaveTool(tool);
  };

  const handleShareTool = async (tool: AITool) => {
    try {
      const shareMessage = `🤖 Check out ${tool.name}! 

${tool.description}

⭐ Rating: ${tool.rating}/5
🔗 Link: ${tool.externalUrl}

🚀 Discover this and 100+ other amazing AI tools on OrbLoop - Everything AI!

Choose from our curated collection of the best AI tools for productivity, creativity, development, and more. Download now and explore the future of AI! `;

      const result = await Share.share({
        message: shareMessage,
        url: tool.externalUrl,
        title: `${tool.name} - AI Tool from OrbLoop`,
      });

      if (result.action === Share.sharedAction) {
        console.log('Tool shared successfully:', tool.name);
      }
    } catch (error) {
      console.error('Error sharing tool:', error);
      Alert.alert('Share Error', 'Unable to share this AI tool. Please try again.');
    }
  };

  const handleCategoryPress = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    switch (tab) {
      case 'home':
        // Already on home screen
        break;
      case 'explore':
        onNavigateToAllListings();
        break;
      case 'saved':
        if (onNavigateToSaved) {
          onNavigateToSaved();
        }
        break;
      case 'settings':
        if (onNavigateToProfile) {
          onNavigateToProfile();
        }
        break;
    }
  };

 const renderToolCard = ({ item }: { item: AITool }) => (
    <View style={styles.cardWrapper}>
      <AICard
        aiTool={item}
        onPress={() => handleCardPress(item)}
        onSave={() => handleSaveTool(item)}
        onShare={() => handleShareTool(item)}
        isSaved={isToolSaved(item)}
        layout="horizontal"
      />
    </View>
  );

  const renderListCard = ({ item }: { item: AITool }) => (
    <AICard
      aiTool={item}
      onPress={() => handleCardPress(item)}
      onSave={() => handleSaveTool(item)}
      onShare={() => handleShareTool(item)}
      isSaved={isToolSaved(item)}
      layout="list"
    />
  );

  const renderGridCard = ({ item }: { item: AITool }) => (
    <AICard
      aiTool={item}
      onPress={() => handleCardPress(item)}
      onSave={() => handleSaveTool(item)}
      onShare={() => handleShareTool(item)}
      isSaved={isToolSaved(item)}
      layout="grid"
    />
  );

  const renderTrendingCard = ({ item }: { item: AITool }) => (
    <View style={[styles.trendingCardWrapper, { width: cardWidth }]}>
      <AICard
        aiTool={item}
        onPress={() => handleCardPress(item)}
        onSave={() => handleSaveTool(item)}
        onShare={() => handleShareTool(item)}
        isSaved={isToolSaved(item)}
        layout="grid"
      />
      <View style={styles.trendingBadge}>
        <Text style={styles.trendingBadgeText}>🔥 Trending</Text>
      </View>
    </View>
  );


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={theme.background} 
      />
      
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.primary]}
            tintColor={theme.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <Text style={styles.greeting}>OrbLoop</Text>
              <Text style={styles.subtitle}>Discover the latest AI tools</Text>
            </View>
          </View>
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
          <TouchableOpacity 
            style={styles.userButton}
            onPress={onNavigateToProfile}
          >
            <Text style={styles.userButtonIcon}>👤</Text>
          </TouchableOpacity>
        </View>

        {/* Category Tabs */}
        <View style={styles.categoryTabsContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryTabsScrollView}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryTab,
                  activeCategory === category.id && styles.activeCategoryTab
                ]}
                onPress={() => handleCategoryPress(category.id)}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={[
                  styles.categoryText,
                  activeCategory === category.id && styles.activeCategoryText
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Trending Tools Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>🔥 Trending AI Tools</Text>
              <Text style={styles.sectionSubtitle}>Most popular this week</Text>
            </View>
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={onNavigateToAllListings}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <Text style={styles.viewAllArrow}>→</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={trendingTools}
            renderItem={renderTrendingCard}
            keyExtractor={(item) => `trending-${item.id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={snapInterval}
            decelerationRate="fast"
            snapToAlignment="start"
            contentContainerStyle={styles.trendingHorizontalList}
            getItemLayout={(data, index) => ({
              length: cardWidth,
              offset: index * snapInterval,
              index,
            })}
          />
        </View>
       

           {/* Latest Releases Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>🆕 Latest Releases</Text>
              <Text style={styles.sectionSubtitle}>Recently added AI tools</Text>
            </View>
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={onNavigateToAllListings}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <Text style={styles.viewAllArrow}>→</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={latestReleases}
            renderItem={renderListCard}
            keyExtractor={(item) => `latest-${item.id}`}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>

 {/* Featured Tools Section - 3 Column Grid */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>⭐ Featured Tools</Text>
              <Text style={styles.sectionSubtitle}>Top picks for you</Text>
            </View>
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={onNavigateToAllListings}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <Text style={styles.viewAllArrow}>→</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.gridContainer}>
            <FlatList
              data={latestReleases.slice(0, 6)} // Show 6 cards in 2 rows of 3
              renderItem={renderGridCard}
              keyExtractor={(item) => `featured-${item.id}`}
              numColumns={3}
              scrollEnabled={false}
              columnWrapperStyle={styles.gridRow}
              contentContainerStyle={styles.gridContent}
            />
          </View>
        </View>
        

        {/* Highest Rated Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>⭐ Highest Rated</Text>
              <Text style={styles.sectionSubtitle}>Top-rated AI tools</Text>
            </View>
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={onNavigateToAllListings}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <Text style={styles.viewAllArrow}>→</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.ratedToolsContainer}>
            {highestRated.map((tool, index) => (
              <TouchableOpacity 
                key={tool.id}
                style={styles.ratedToolItem}
                onPress={() => handleCardPress(tool)}
              >
                <View style={styles.ratedToolRank}>
                  <Text style={styles.rankNumber}>{index + 1}</Text>
                </View>
                <View style={styles.ratedToolInfo}>
                  <Text style={styles.ratedToolName}>{tool.name}</Text>
                  <Text style={styles.ratedToolCategory}>{tool.category}</Text>
                </View>
                <View style={styles.ratedToolRating}>
                  <Text style={styles.ratingText}>⭐ {tool.rating}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

     

         {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      <BottomNavigation
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />
    </SafeAreaView>
  );
};

const createStyles = (theme: any, isDarkMode?: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerButtonIcon: {
    fontSize: 18,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: theme.textSecondary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.cardBackground,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: theme.border || 'rgba(0,0,0,0.1)',
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
  userButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userButtonIcon: {
    fontSize: 18,
  },
  categoryTabsContainer: {
    paddingVertical: 15,
  },
  categoryTabsScrollView: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.cardBackground,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: theme.border || 'rgba(0,0,0,0.1)',
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activeCategoryTab: {
    backgroundColor: theme.categoryTabActive,
    borderColor: theme.categoryTabActive,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.text,
  },
  activeCategoryText: {
    color: theme.textOnPrimary,
    fontWeight: '600',
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.cardBackground,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: theme.textSecondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    color: theme.primary,
    fontWeight: '600',
  },
  viewAllArrow: {
    fontSize: 16,
    color: theme.primary,
  },
  gridContainer: {
    paddingHorizontal: 20,
  },
  gridContent: {
    gap: 10,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  horizontalList: {
    paddingLeft: 20,
    gap: 15,
  },
  cardWrapper: {
    width: 200,
  },
  trendingCardWrapper: {
    marginRight: 10,
    position: 'relative',
  },
  trendingCard: {
    position: 'relative',
    backgroundColor: theme.cardBackground,
    borderRadius: 12,
    padding: 12,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
 trendingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: theme.trendingBadge,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 3,
    zIndex: 1,
  },
  trendingBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: theme.textOnError,
  },
  trendingHorizontalList: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  ratedToolItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.cardBackground,
    borderRadius: 12,
    padding: 15,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  ratedToolRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  rankNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  ratedToolInfo: {
    flex: 1,
  },
  ratedToolName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 2,
  },
  ratedToolCategory: {
    fontSize: 12,
    color: theme.textSecondary,
  },
  ratedToolRating: {
    marginLeft: 10,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.accent,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 15,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: theme.cardBackground,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  quickActionSubtitle: {
    fontSize: 11,
    color: theme.textSecondary,
    textAlign: 'center',
    lineHeight: 14,
  },
  bottomSpacing: {
    height: 20,
  },
  ratedToolsContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
});

export default HomeScreen;
