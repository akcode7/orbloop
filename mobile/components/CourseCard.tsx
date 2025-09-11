// components/CourseCard.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useTheme } from '../themes/colors';
import { Course } from '../aitypes/course_type';
import StarIcon from '../src/assets/icons/star_icon';
import FireIcon from '../src/assets/icons/fire_icon';

interface CourseCardProps {
  course: Course;
  onPress: (course: Course) => void;
  cardWidth?: number;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onPress, cardWidth }) => {
  const theme = useTheme();
  const styles = createStyles(theme, cardWidth);
 
  // Function to get the highest priority badge
  const getPrimaryBadge = () => {
    if (course.premium) {
      return { type: 'premium', text: '💎 Premium', style: styles.premiumBadge };
    }
    if (course.featured) {
      return { type: 'featured', text: '⭐ Featured', style: styles.featuredBadge };
    }
    if (course.trending) {
      return { type: 'trending', text: '🔥 Trending', style: styles.trendingBadge };
    }
    return null;
  };
 
  const primaryBadge = getPrimaryBadge();

  return (
    <TouchableOpacity
      style={styles.courseCard}
      onPress={() => onPress(course)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: course.image }} style={styles.courseImage} />

         
        {/* Rating positioned at top left */}
        {course.rating && (
          <View style={styles.imageRatingContainer}>
            <View style={styles.ratingContent}>
              <StarIcon width={10} height={10} fill="#ffffff" />
              <Text style={[styles.imageRatingText, { marginLeft: 3 }]}>{course.rating}</Text>
            </View>
          </View>
        )}

         {/* Single badge positioned at top right */}
        {primaryBadge && (
          <View style={styles.badgeContainer}>
            <View style={primaryBadge.style}>
              {primaryBadge.text}
            </View>
          </View>
        )}

      </View>
      <View style={styles.courseContent}>
        <View style={styles.courseHeader}>
          <Text style={styles.courseTitle} numberOfLines={2} ellipsizeMode="tail">
            {course.title}
          </Text>
        </View>
        <Text style={styles.courseDescription}>{course.description}</Text>
        <View style={styles.courseFooter}>
          <Text style={styles.courseCategory}>{course.category}</Text>
          <View style={styles.courseStats}>
            <Text style={styles.courseDuration}>⏱️ {course.duration}</Text>
            <Text style={styles.courseLessons}>📋 {course.lessons} lessons</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.learnButton}
          onPress={() => onPress(course)}
        >
          <Text style={styles.learnButton}>Learn Now</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (theme: any, cardWidth?: number) => StyleSheet.create({
  courseCard: {
    backgroundColor: theme.cardBackground,
    borderRadius: 12,
    marginBottom: 0, // Remove bottom margin for grid layout
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    width: cardWidth || '100%',
    minHeight: 280, // Set minimum height for consistent card sizing
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 100,
  },
  courseImage: {
    width: '100%',
    height: 100, // Reduced height for grid layout
    backgroundColor: theme.border,
  },
  badgeContainer: {
    position: 'absolute',
    top: 6,
    right: 6,
    zIndex: 1,
  },

  imageRatingContainer: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    zIndex: 1,
  },
  imageRatingText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
 premiumBadge: {
    backgroundColor: '#9B59B6',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  trendingBadge: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  featuredBadge: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  ratingContainer: {
    backgroundColor: theme.cardBackground,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.border,
  },
   ratingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: theme.text,
  },
  courseContent: {
    padding: 12, // Reduced padding for grid layout
    flex: 1,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    height: 44, // Fixed height to accommodate 2 lines of title
  },
  courseTitle: {
    fontSize: 16, // Reduced font size for grid layout
    fontWeight: '600',
    color: theme.text,
    flex: 1,
    marginRight: 8, // Reduced margin
    lineHeight: 20, // Set line height for consistent spacing
  },
 
  courseDescription: {
    fontSize: 13, // Reduced font size
    color: theme.textSecondary,
    lineHeight: 18, // Adjusted line height
    marginBottom: 10, // Reduced margin
  },
  courseFooter: {
    flexDirection: 'column', // Stack vertically for better space usage
    marginBottom: 12, // Reduced margin
  },
  courseCategory: {
    fontSize: 11, // Reduced font size
    color: theme.primary,
    fontWeight: '500',
    marginBottom: 4,
  },
  courseStats: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Spread across width
  },
  courseDuration: {
    fontSize: 11, // Reduced font size
    color: theme.textSecondary,
  },
  courseLessons: {
    fontSize: 11, // Reduced font size
    color: theme.textSecondary,
  },
  learnButton: {
    backgroundColor: theme.primary,
    paddingVertical: 4, // Reduced padding
    paddingHorizontal: 20, // Reduced padding
    borderRadius: 6, // Smaller border radius
    alignItems: 'center',
    marginTop: 'auto', // Push to bottom of card
  },
});

export default CourseCard;