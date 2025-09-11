// screens/learn_ai_detailed.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, useIsDarkMode } from '../themes/colors';
import { Course } from '../aitypes/course_type';

interface LearnAIDetailedScreenProps {
  course?: Course;
  onBack: () => void;
}

const LearnAIDetailedScreen: React.FC<LearnAIDetailedScreenProps> = ({
  course,
  onBack,
}) => {
  const theme = useTheme();
  const isDarkMode = useIsDarkMode();
  const styles = createStyles(theme);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return '#2ECC71';
      case 'Intermediate':
        return '#F39C12';
      case 'Advanced':
        return '#E74C3C';
      default:
        return theme.textSecondary;
    }
  };

  if (!course) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Article not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={theme.background} 
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Article</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Article Image */}
        <Image source={{ uri: course.image }} style={styles.articleImage} />

        {/* Article Content */}
        <View style={styles.articleContainer}>
          {/* Title and Meta Info */}
          <View style={styles.titleSection}>
            <Text style={styles.articleTitle}>{course.title}</Text>
            
            <View style={styles.metaRow}>
              <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(course.difficulty) }]}>
                <Text style={styles.difficultyText}>{course.difficulty}</Text>
              </View>
              <Text style={styles.readTime}>📖 {course.readTime}</Text>
              <Text style={styles.category}>🏷️ {course.category}</Text>
            </View>
          </View>

          {/* Article Description */}
          <Text style={styles.articleDescription}>{course.description}</Text>

          {/* Article Content */}
          <View style={styles.contentSection}>
            <Text style={styles.articleContent}>{course.content}</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            <TouchableOpacity style={styles.bookmarkButton}>
              <Text style={styles.bookmarkButtonText}>🔖 Bookmark Article</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.shareButton}>
              <Text style={styles.shareButtonText}>📤 Share Article</Text>
            </TouchableOpacity>
          </View>

          {/* Related Articles Section */}
          <View style={styles.relatedSection}>
            <Text style={styles.sectionTitle}>Related Articles</Text>
            <Text style={styles.relatedPlaceholder}>More articles coming soon...</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollView: {
    flex: 1,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 24,
    color: theme.text,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text,
  },
  placeholder: {
    width: 40,
  },
  articleImage: {
    width: '100%',
    height: 250,
    backgroundColor: theme.border,
  },
  articleContainer: {
    padding: 20,
  },
  titleSection: {
    marginBottom: 16,
  },
  articleTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.text,
    lineHeight: 36,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  readTime: {
    fontSize: 14,
    color: theme.textSecondary,
    fontWeight: '500',
  },
  category: {
    fontSize: 14,
    color: theme.textSecondary,
    fontWeight: '500',
  },
  articleDescription: {
    fontSize: 18,
    color: theme.textSecondary,
    lineHeight: 26,
    marginBottom: 24,
    fontStyle: 'italic',
  },
  contentSection: {
    marginBottom: 32,
  },
  articleContent: {
    fontSize: 16,
    color: theme.text,
    lineHeight: 26,
    textAlign: 'justify',
  },
  actionSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  bookmarkButton: {
    flex: 1,
    backgroundColor: theme.cardBackground,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.border,
    alignItems: 'center',
  },
  bookmarkButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.text,
  },
  shareButton: {
    flex: 1,
    backgroundColor: theme.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  shareButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
  relatedSection: {
    borderTopWidth: 1,
    borderTopColor: theme.border,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 16,
  },
  relatedPlaceholder: {
    fontSize: 14,
    color: theme.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: theme.textSecondary,
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: theme.primary,
    fontWeight: '500',
  },
});

export default LearnAIDetailedScreen;