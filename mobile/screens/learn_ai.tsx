import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, useIsDarkMode } from '../themes/colors';
import BottomNavigation from '../components/bottom_navigation';
import CourseCard from '../components/CourseCard';
import FilterModal from '../components/FilterModal';
import CourseCategoryModal from '../components/CourseCategoryModal';
import SearchIcon from '../src/assets/icons/search_icon';
import { Course } from '../aitypes/course_type';

interface LearnAIScreenProps {
  onNavigateToHome?: () => void;
  onNavigateToExplore?: () => void;
  onNavigateToSaved?: () => void;
  onNavigateToCourse?: (course: Course) => void;
}

const LearnAIScreen: React.FC<LearnAIScreenProps> = ({
  onNavigateToHome,
  onNavigateToExplore,
  onNavigateToSaved,
  onNavigateToCourse,
}) => {
   const theme = useTheme();
  const isDarkMode = useIsDarkMode();
  const styles = createStyles(theme);
  const [activeTab, setActiveTab] = useState('learn');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = (screenWidth - 60) / 2; // Account for padding and gaps

  const categories = ['All', 'Developers', 'Video Editing', 'Photo Editing', 'Content Writing', 'Prompt Engineering'];
  const filters = ['All', 'Premium', 'Free', 'Trending', 'Featured', 'Top Rated'];

  const courses: Course[] = [
    {
      id: '2',
      title: 'Creating Trending Videos with AI',
      description: 'Master the art of creating viral content using AI tools',
      duration: '25 min',
      difficulty: 'Intermediate',
      image: 'https://via.placeholder.com/120x80/FF6B6B/FFFFFF?text=VIDEO',
      category: 'Video Editing',
      lessons: 5,
      readTime: '25 min read',
      content: 'Learn to create viral content using modern AI tools and techniques...',
      featured: true,
      trending: true,
      premium: true,
      rating: 4.9,
    },
    {
      id: '3',
      title: 'Edit Photos Using AI',
      description: 'Professional photo editing techniques with AI assistance',
      duration: '20 min',
      difficulty: 'Beginner',
      image: 'https://via.placeholder.com/120x80/4ECDC4/FFFFFF?text=PHOTO',
      category: 'Photo Editing',
      lessons: 4,
      readTime: '20 min read',
      content: 'Professional photo editing techniques with AI assistance and tools...',
      featured: false,
      trending: false,
      premium: false,
      rating: 4.6,
    },
    {
      id: '4',
      title: 'React Native Development',
      description: 'Build mobile apps with React Native and AI integration',
      duration: '45 min',
      difficulty: 'Advanced',
      image: 'https://via.placeholder.com/120x80/9B59B6/FFFFFF?text=RN',
      category: 'Developers',
      lessons: 8,
      readTime: '45 min read',
      content: 'Comprehensive guide to building mobile apps with React Native and AI...',
      featured: true,
      trending: false,
      premium: true,
      rating: 4.7,
    },
    {
      id: '5',
      title: 'AI Content Writing',
      description: 'Write engaging content with AI assistance and tools',
      duration: '30 min',
      difficulty: 'Intermediate',
      image: 'https://via.placeholder.com/120x80/E67E22/FFFFFF?text=WRITE',
      category: 'Content Writing',
      lessons: 6,
      readTime: '30 min read',
      content: 'Master the art of writing engaging content with AI assistance...',
      featured: false,
      trending: true,
      premium: false,
      rating: 4.5,
    },
    {
      id: '6',
      title: 'Advanced Prompt Techniques',
      description: 'Master advanced prompting strategies for better AI outputs',
      duration: '35 min',
      difficulty: 'Advanced',
      image: 'https://via.placeholder.com/120x80/2ECC71/FFFFFF?text=PROMPT',
      category: 'Prompt Engineering',
      lessons: 7,
      readTime: '35 min read',
      content: 'Advanced prompting strategies for better AI outputs and results...',
      featured: true,
      trending: false,
      premium: true,
      rating: 4.9,
    },
    {
      id: '7',
      title: 'Python for AI Development',
      description: 'Learn Python fundamentals for AI and machine learning',
      duration: '50 min',
      difficulty: 'Intermediate',
      image: 'https://via.placeholder.com/120x80/3498DB/FFFFFF?text=PY',
      category: 'Developers',
      lessons: 10,
      readTime: '50 min read',
      content: 'Python fundamentals for AI and machine learning development...',
      featured: false,
      trending: true,
      premium: false,
      rating: 4.8,
    },
    {
      id: '8',
      title: 'AI Video Effects',
      description: 'Add stunning AI-powered effects to your videos',
      duration: '28 min',
      difficulty: 'Beginner',
      image: 'https://via.placeholder.com/120x80/E74C3C/FFFFFF?text=VFX',
      category: 'Video Editing',
      lessons: 5,
      readTime: '28 min read',
      content: 'Learn to add stunning AI-powered effects to your videos...',
      featured: false,
      trending: false,
      premium: true,
      rating: 4.4,
    },
  ];

  // Filter courses based on selected category, filter, and search query
  const filteredCourses = courses.filter((course) => {
    // Filter by search query
    const searchMatch = searchQuery === '' || 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by category
    const categoryMatch = selectedCategory === 'All' || course.category === selectedCategory;
    
    // Filter by type
    let filterMatch = true;
    switch (selectedFilter) {
      case 'Premium':
        filterMatch = course.premium === true;
        break;
      case 'Free':
        filterMatch = course.premium === false;
        break;
      case 'Trending':
        filterMatch = course.trending === true;
        break;
      case 'Featured':
        filterMatch = course.featured === true;
        break;
      case 'Top Rated':
        filterMatch = course.rating !== undefined && course.rating >= 4.7;
        break;
      case 'All':
      default:
        filterMatch = true;
        break;
    }
    
    return searchMatch && categoryMatch && filterMatch;
  });

 const handleCoursePress = (course: Course) => {
    if (onNavigateToCourse) {
      onNavigateToCourse(course);
    }
  };

  const handleFilterPress = () => {
    setShowFilterModal(true);
  };

  const handleCategoryPress = () => {
    setShowCategoryModal(true);
  };

  const handleCloseFilterModal = () => {
    setShowFilterModal(false);
  };

  const handleCloseCategoryModal = () => {
    setShowCategoryModal(false);
  };

  const handleSelectFilter = (filterId: string) => {
    setSelectedFilter(filterId);
  };

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
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
        if (onNavigateToExplore) {
          onNavigateToExplore();
        }
        break;
      case 'saved':
        if (onNavigateToSaved) {
          onNavigateToSaved();
        }
        break;
      case 'learn':
        // Already on learn screen
        break;
    }
  };

 

  const renderCourseCard = ({ item }: { item: Course }) => (
    <CourseCard course={item} onPress={handleCoursePress} cardWidth={cardWidth} />
  );

  const renderCategoryTab = (category: string) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryTab,
        selectedCategory === category && styles.activeCategoryTab
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <Text style={[
        styles.categoryTabText,
        selectedCategory === category && styles.activeCategoryTabText
      ]}>
        {category}
      </Text>
    </TouchableOpacity>
  );


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={theme.background} 
      />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Learn AI</Text>
          <Text style={styles.headerSubtitle}>Master AI with practical courses</Text>
        </View>
        
          {/* Search Input */}
        <View style={styles.searchContainer}>
          <View style={styles.searchIconContainer}>
            <SearchIcon width={16} height={16} fill={theme.textSecondary} />
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Search courses..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}
            >
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

       {/* Category Tabs */}
      <View style={styles.categoryContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScrollContent}
        >
          {categories.map(renderCategoryTab)}
          <TouchableOpacity
            style={styles.categoryModalButton}
            onPress={handleCategoryPress}
          >
            <Text style={styles.categoryModalButtonText}>📋 More Categories</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

 {/* Filter Container */}
        <View style={styles.filterContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScrollContent}
          >
            <TouchableOpacity
              style={styles.filterModalButton}
              onPress={handleFilterPress}
            >
              <Text style={styles.filterModalButtonText}>🔧 More Filters</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

      

      {/* Results Count */}
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsText}>
            {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
            {searchQuery && ` for "${searchQuery}"`}
          </Text>
        </View>

     <FlatList
        data={filteredCourses}
        renderItem={renderCourseCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.coursesList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery ? `No courses found for "${searchQuery}"` : 'No courses found'}
            </Text>
            <Text style={styles.emptySubtext}>
              {searchQuery ? 'Try a different search term or adjust your filters' : 'Try adjusting your filters'}
            </Text>
          </View>
        }
      />

        <BottomNavigation
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />

       <FilterModal
        visible={showFilterModal}
        onClose={handleCloseFilterModal}
        onSelectFilter={handleSelectFilter}
        onSelectCategory={handleSelectCategory}
        selectedFilter={selectedFilter}
        selectedCategory={selectedCategory}
      />

      <CourseCategoryModal
        visible={showCategoryModal}
        onClose={handleCloseCategoryModal}
        onSelectCategory={handleSelectCategory}
        onSelectFilter={handleSelectFilter}
        selectedCategory={selectedCategory}
        selectedFilter={selectedFilter}
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
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: theme.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  headerContent: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: theme.textSecondary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.cardBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  searchIconContainer: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.text,
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  clearButtonText: {
    fontSize: 14,
    color: theme.textSecondary,
    fontWeight: 'bold',
  },
  categoryContainer: {
    backgroundColor: theme.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    paddingVertical: 12,
  },
  categoryScrollContent: {
    paddingHorizontal: 20,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: theme.cardBackground,
    borderWidth: 1,
    borderColor: theme.border,
  },
  activeCategoryTab: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  categoryTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.text,
  },
  activeCategoryTabText: {
    color: '#ffffff',
  },
  categoryModalButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: theme.primary,
    borderWidth: 1,
    borderColor: theme.primary,
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryModalButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  filterContainer: {
    backgroundColor: theme.background,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  filterScrollContent: {
    paddingHorizontal: 20,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: theme.cardBackground,
    borderWidth: 1,
    borderColor: theme.border,
  },
  activeFilterButton: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.text,
  },

  activeFilterButtonText: {
    color: '#ffffff',
  },
  filterModalButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: theme.primary,
    borderWidth: 1,
    borderColor: theme.primary,
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  filterModalButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  resultsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: theme.background,
  },
  resultsText: {
    fontSize: 14,
    color: theme.textSecondary,
    fontWeight: '500',
  },
  coursesList: {
    padding: 20,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.textSecondary,
  },
});

export default LearnAIScreen;