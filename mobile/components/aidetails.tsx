import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  Linking,
  Alert,
  Modal,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AITool } from '../aitypes/ai_type';
import StarIcon from '../src/assets/icons/star_icon';
import { useTheme, useIsDarkMode } from '../themes/colors';

interface AIDetailScreenProps {
  aiTool: AITool;
  onBack: () => void;
  onRateAI?: (aiToolId: string, rating: number) => void;
}

const AIDetailScreen: React.FC<AIDetailScreenProps> = ({
  aiTool,
  onBack,
  onRateAI,
}) => {
  const theme = useTheme();
  const isDarkMode = useIsDarkMode();
  const styles = createStyles(theme);
  const [userRating, setUserRating] = useState<number>(0);
  const [hasRated, setHasRated] = useState<boolean>(false);
  const [isEditingRating, setIsEditingRating] = useState<boolean>(false);
  const [showThankYouModal, setShowThankYouModal] = useState<boolean>(false);
  const [thankYouMessage, setThankYouMessage] = useState<string>('');
  
 const handleVisitExternal = async () => {
    if (!aiTool.externalUrl) {
      Alert.alert('Error', 'No URL available for this AI tool');
      return;
    }

    try {
      console.log('Opening URL from detail screen:', aiTool.externalUrl);
      await Linking.openURL(aiTool.externalUrl);
      console.log('URL opened successfully from detail screen');
    } catch (error) {
      console.error('Error opening URL from detail screen:', error);
      Alert.alert(
        'Cannot Open Link',
        `Unable to open ${aiTool.name} website. Please make sure you have a browser app installed.`
      );
    }
  };

  const handleRating = (rating: number) => {
    setUserRating(rating);
    setHasRated(true);
    setIsEditingRating(false);
    
    if (onRateAI) {
      onRateAI(aiTool.id, rating);
    }
    
    const action = userRating > 0 ? 'updated' : 'rated';
    setThankYouMessage(`You ${action} ${aiTool.name} to ${rating} star${rating !== 1 ? 's' : ''}!`);
    setShowThankYouModal(true);
  };

  const handleEditRating = () => {
    setIsEditingRating(true);
  };

  const handleCancelEdit = () => {
    setIsEditingRating(false);
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          style={styles.starButton}
          onPress={() => handleRating(i)}
          activeOpacity={0.7}
          disabled={hasRated && !isEditingRating}
        >
          <Text style={[
            styles.starText,
            {
              color: i <= userRating 
                ? theme.warning 
                : theme.textSecondary,
              opacity: (hasRated && !isEditingRating) ? 0.7 : 1,
            }
          ]}>
            ★
          </Text>
        </TouchableOpacity>
      );
    }
    return stars;
  };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={theme.surface} 
      />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Tool Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
           {/* Top Section with Image and Title */}
          <View style={styles.topSection}>
            <Image source={{ uri: aiTool.image }} style={styles.image} />
            <View style={styles.titleSection}>
              <Text style={styles.title}>{aiTool.name}</Text>
              {aiTool.category && (
                <Text style={styles.category}>{aiTool.category}</Text>
              )}
              {aiTool.rating && (
                <View style={styles.officialRatingContainer}>
                  <View style={styles.officialRatingContent}>
                    <StarIcon width={14} height={14} fill="#FFD700" />
                    <Text style={styles.officialRatingText}>
                      {aiTool.rating.toFixed(1)} (Official Rating)
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Action Button */}
          <View style={styles.actionSection}>
            <TouchableOpacity
              style={styles.visitButton}
              onPress={handleVisitExternal}
            >
              <Text style={styles.visitButtonText}>Visit Website</Text>
            </TouchableOpacity>
          </View>

          

         
           {/* User Rating Section */}
          <View style={styles.ratingSection}>
            <Text style={styles.ratingTitle}>
              {hasRated && !isEditingRating ? 'Your Rating' : 'Rate this AI Tool'}
            </Text>
            <Text style={styles.ratingSubtitle}>
              {hasRated && !isEditingRating 
                ? 'Thank you for rating this tool!' 
                : 'Help others by sharing your experience'
              }
            </Text>
            <View style={styles.starsContainer}>
              {renderStars()}
            </View>
            {hasRated && !isEditingRating && (
              <View style={styles.ratingActionsContainer}>
                <Text style={styles.ratingFeedback}>
                  You rated this tool {userRating} star{userRating !== 1 ? 's' : ''}
                </Text>
                <TouchableOpacity
                  style={styles.editRatingButton}
                  onPress={handleEditRating}
                >
                  <Text style={styles.editRatingButtonText}>✏️ Edit Rating</Text>
                </TouchableOpacity>
              </View>
            )}
            {isEditingRating && (
              <View style={styles.editingActionsContainer}>
                <Text style={styles.editingInstructions}>
                  Tap a star to update your rating
                </Text>
                <TouchableOpacity
                  style={styles.cancelEditButton}
                  onPress={handleCancelEdit}
                >
                  <Text style={styles.cancelEditButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>


         {/* Description Section */}
          <View style={styles.descriptionSection}>
            <Text style={styles.descriptionTitle}>About</Text>
            <Text style={styles.description}>{aiTool.description}</Text>
          </View>

          {/* Additional Info Section */}
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Details</Text>
            <View style={styles.infoGrid}>
              {aiTool.pricing && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Pricing</Text>
                  <Text style={styles.infoValue}>{aiTool.pricing}</Text>
                </View>
              )}
              {aiTool.subcategory && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Subcategory</Text>
                  <Text style={styles.infoValue}>{aiTool.subcategory}</Text>
                </View>
              )}
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Open Source</Text>
                <Text style={styles.infoValue}>
                  {aiTool.isOpenSource ? 'Yes' : 'No'}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Trending</Text>
                <Text style={styles.infoValue}>
                  {aiTool.isTrending ? 'Yes' : 'No'}
                </Text>
              </View>
            </View>
            {aiTool.tags && aiTool.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                <Text style={styles.tagsTitle}>Tags</Text>
                <View style={styles.tags}>
                  {aiTool.tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

         
        </View>
      </ScrollView>

       {/* Custom Thank You Modal */}
      <Modal
        visible={showThankYouModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowThankYouModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Thank you!</Text>
            </View>
            <Text style={styles.modalMessage}>{thankYouMessage}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowThankYouModal(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  backButtonText: {
    fontSize: 16,
    color: theme.primary,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text,
  },
  placeholder: {
    width: 60,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  topSection: {
    flexDirection: 'row',
    marginBottom: 32,
    backgroundColor: theme.surface,
    padding: 20,
    borderRadius: 12,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 20,
    backgroundColor: theme.border,
  },
  titleSection: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 8,
    lineHeight: 34,
  },
  category: {
    fontSize: 14,
    color: theme.primary,
    backgroundColor: theme.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    fontWeight: '500',
    marginBottom: 8,
  },
  officialRatingContainer: {
    marginTop: 4,
  },
  officialRatingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  officialRatingText: {
    fontSize: 14,
    color: theme.textSecondary,
    fontWeight: '500',
  },
  ratingSection: {
    backgroundColor: theme.surface,
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  ratingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 4,
  },
  ratingSubtitle: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 16,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  starButton: {
    padding: 4,
  },
  starText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  ratingFeedback: {
    fontSize: 14,
    color: theme.primary,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
  },
  ratingActionsContainer: {
    alignItems: 'center',
    width: '100%',
  },
  editRatingButton: {
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 4,
  },
  editRatingButtonText: {
    color: theme.primary,
    fontSize: 12,
    fontWeight: '500',
  },
  editingActionsContainer: {
    alignItems: 'center',
    width: '100%',
    marginTop: 8,
  },
  editingInstructions: {
    fontSize: 12,
    color: theme.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  cancelEditButton: {
    backgroundColor: theme.textSecondary + '20',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  cancelEditButtonText: {
    color: theme.textSecondary,
    fontSize: 11,
    fontWeight: '500',
  },
  infoSection: {
    backgroundColor: theme.surface,
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 16,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  infoItem: {
    flex: 1,
    minWidth: '45%',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: theme.textSecondary,
    fontWeight: '500',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    color: theme.text,
    fontWeight: '500',
  },
  tagsContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
  tagsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 12,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: theme.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.primary + '30',
  },
  tagText: {
    fontSize: 12,
    color: theme.primary,
    fontWeight: '500',
  },
  descriptionSection: {
    backgroundColor: theme.surface,
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  descriptionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 26,
    color: theme.textSecondary,
  },
  actionSection: {
    marginTop: 20,
    marginBottom: 24,
  },
  visitButton: {
    backgroundColor: theme.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  visitButtonText: {
    color: theme.textOnPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: theme.surface,
    borderRadius: 20,
    padding: 24,
    margin: 20,
    minWidth: 280,
    maxWidth: 340,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text,
  },
  modalMessage: {
    fontSize: 16,
    color: theme.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: theme.primary,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    color: theme.textOnPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AIDetailScreen;