// components/AICard.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { AITool } from '../aitypes/ai_type';
import Button from './buttons';
import { useTheme } from '../themes/colors';

interface AICardProps {
  aiTool: AITool;
  onPress: () => void;
  onSave: () => void;
  onShare?: () => void;
  isSaved?: boolean;
  layout?: 'grid' | 'horizontal' | 'list';
}

const { width } = Dimensions.get('window');

const AICard: React.FC<AICardProps> = ({
  aiTool,
  onPress,
  onSave,
  onShare,
  isSaved = false,
  layout = 'horizontal',
}) => {
  const theme = useTheme();
  const styles = createStyles(theme, layout);

  const handleOpenPress = () => {
    console.log('Open button pressed for:', aiTool.name);
    onPress();
  };

  const handleSavePress = () => {
    console.log('Save button pressed for:', aiTool.name);
    onSave();
  };

  const handleSharePress = () => {
    console.log('Share button pressed for:', aiTool.name);
    if (onShare) {
      onShare();
    }
  };

  if (layout === 'list') {
      return (
      <View style={styles.listCard}>
        <Image source={{ uri: aiTool.image }} style={styles.listImage} />
        <View style={styles.listContent}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle} numberOfLines={2}>
              {aiTool.name}
            </Text>
            <View style={styles.listTopActions}>
              <View style={styles.listRating}>
                <Text style={styles.listRatingText}>⭐ {aiTool.rating}</Text>
              </View>
              <TouchableOpacity style={styles.listShareButton} onPress={handleSharePress}>
                <Text style={styles.listShareIcon}>📤</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.listDescription} numberOfLines={3}>
            {aiTool.description}
          </Text>
          <View style={styles.listActions}>
            <Button
              title={isSaved ? "Remove" : "Save"}
              variant="outline"
              size="small"
              onPress={handleSavePress}
              icon={isSaved ? "🗑️" : "🔖"}
              style={styles.listSaveButton}
              textStyle={styles.listButtonText}
            />
            <Button
              title="Open"
              variant="primary"
              size="small"
              onPress={handleOpenPress}
              style={styles.listOpenButton}
              textStyle={styles.listButtonText}
            />
          </View>
        </View>
      </View>
    );
  }

  return (
     <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: aiTool.image }} style={styles.cardImage} />
        <TouchableOpacity style={styles.shareButton} onPress={handleSharePress}>
          <Text style={styles.shareIcon}>📤</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {aiTool.name}
          </Text>
          <View style={styles.rating}>
            <Text style={styles.ratingText}>⭐ {aiTool.rating}</Text>
          </View>
        </View>
        <Text style={styles.cardDescription} numberOfLines={2}>
          {aiTool.description}
        </Text>
        <View style={styles.cardActions}>
          <Button
            title={isSaved ? "Remove" : "Save"}
            variant="outline"
            size="small"
            onPress={handleSavePress}
            icon={isSaved ? "🗑️" : "🔖"}
            style={styles.saveButton}
            textStyle={styles.saveButtonText}
          />
          <Button
            title="Open"
            variant="primary"
            size="small"
            onPress={handleOpenPress}
            style={styles.openButton}
            textStyle={styles.openButtonText}
          />
        </View>
      </View>
    </View>
  );
};

const createStyles = (theme: any, layout: 'grid' | 'horizontal' | 'list') => {
  const cardWidth = layout === 'grid' 
    ? (width - 60) / 3  // 3 columns with 20px padding on sides and 10px gap between cards
    : (width - 50) / 2;  // Original 2 column layout for horizontal scrolling

  return StyleSheet.create({
   card: {
      width: cardWidth,
      backgroundColor: theme.cardBackground,
      borderRadius: layout === 'grid' ? 12 : 15,
      marginBottom: 15,
      overflow: 'hidden',
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    imageContainer: {
      position: 'relative',
    },
    cardImage: {
      width: '100%',
      height: layout === 'grid' ? 80 : 120,
      backgroundColor: theme.border,
    },
    shareButton: {
      position: 'absolute',
      bottom: 8,
      right: 8,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      borderRadius: 16,
      width: 32,
      height: 32,
      justifyContent: 'center',
      alignItems: 'center',
    },
    shareIcon: {
      fontSize: layout === 'grid' ? 14 : 16,
      color: '#ffffff',
    },
    cardContent: {
      padding: layout === 'grid' ? 10 : 15,
    },
    cardHeader: {
      flexDirection: layout === 'grid' ? 'column' : 'row',
      justifyContent: 'space-between',
      alignItems: layout === 'grid' ? 'flex-start' : 'flex-start',
      marginBottom: 4,
    },
    cardTitle: {
      fontSize: layout === 'grid' ? 14 : 16,
      fontWeight: 'bold',
      color: theme.text,
      flex: 1,
      marginRight: layout === 'grid' ? 0 : 8,
    },
    rating: {
      backgroundColor: theme.primary + '20',
      borderRadius: 8,
      paddingHorizontal: layout === 'grid' ? 6 : 8,
      paddingVertical: layout === 'grid' ? 2 : 3,
      marginTop: layout === 'grid' ? 4 : 0,
      alignSelf: layout === 'grid' ? 'flex-start' : 'flex-end',
    },
    ratingText: {
      fontSize: layout === 'grid' ? 9 : 11,
      fontWeight: '600',
      color: theme.primary,
    },
    cardDescription: {
      fontSize: layout === 'grid' ? 10 : 12,
      color: theme.textSecondary,
      marginBottom: layout === 'grid' ? 10 : 15,
      lineHeight: layout === 'grid' ? 14 : 16,
    },
    cardActions: {
      flexDirection: layout === 'grid' ? 'column' : 'row',
      justifyContent: 'space-between',
      gap: layout === 'grid' ? 6 : 8,
    },
    saveButton: {
      flex: layout === 'grid' ? undefined : 0.45,
      paddingVertical: layout === 'grid' ? 6 : 8,
    },
    saveButtonText: {
      fontSize: layout === 'grid' ? 10 : 12,
    },
    openButton: {
      flex: layout === 'grid' ? undefined : 0.45,
      paddingVertical: layout === 'grid' ? 6 : 8,
    },
    openButtonText: {
      fontSize: layout === 'grid' ? 10 : 12,
    },
    // List layout styles
 listCard: {
      flexDirection: 'row',
      backgroundColor: theme.cardBackground,
      borderRadius: 15,
      marginHorizontal: 20,
      marginBottom: 15,
      padding: 15,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    listImage: {
      width: 80,
      height: 80,
      borderRadius: 10,
      backgroundColor: theme.border,
    },
    listContent: {
      flex: 1,
      justifyContent: 'space-between',
      marginLeft: 15,
    },
    listHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 6,
    },
    listTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.text,
      flex: 1,
      marginRight: 10,
    },
    listTopActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    listRating: {
      backgroundColor: theme.primary + '20',
      borderRadius: 8,
      paddingHorizontal: 8,
      paddingVertical: 3,
    },
    listRatingText: {
      fontSize: 11,
      fontWeight: '600',
      color: theme.primary,
    },
    listShareButton: {
      backgroundColor: theme.cardBackground,
      borderRadius: 16,
      width: 28,
      height: 28,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.border,
    },
    listShareIcon: {
      fontSize: 12,
      color: theme.textSecondary,
    },
    listDescription: {
      fontSize: 13,
      color: theme.textSecondary,
      lineHeight: 18,
      marginBottom: 12,
      flex: 1,
    },
    listActions: {
      flexDirection: 'row',
      gap: 10,
    },
    listSaveButton: {
      flex: 0.45,
      paddingVertical: 8,
    },
    listOpenButton: {
      flex: 0.45,
      paddingVertical: 8,
    },
    listButtonText: {
      fontSize: 12,
    },
  });
};

export default AICard;