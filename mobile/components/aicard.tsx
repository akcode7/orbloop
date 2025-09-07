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
  isSaved?: boolean;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 50) / 2;

const AICard: React.FC<AICardProps> = ({
  aiTool,
  onPress,
  onSave,
  isSaved = false,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const handleOpenPress = () => {
    console.log('Open button pressed for:', aiTool.name);
    onPress();
  };

  const handleSavePress = () => {
    console.log('Save button pressed for:', aiTool.name);
    onSave();
  };

  return (
    <View style={styles.card}>
      <Image source={{ uri: aiTool.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {aiTool.name}
        </Text>
        <Text style={styles.cardDescription} numberOfLines={2}>
          {aiTool.description}
        </Text>
        <View style={styles.cardActions}>
          <Button
            title="Save"
            variant="outline"
            size="small"
            onPress={handleSavePress}
            icon="🔖"
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

const createStyles = (theme: any) => StyleSheet.create({
  card: {
    width: cardWidth,
    backgroundColor: theme.cardBackground,
    borderRadius: 15,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 120,
    backgroundColor: theme.border,
  },
  cardContent: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 12,
    color: theme.textSecondary,
    marginBottom: 15,
    lineHeight: 16,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  saveButton: {
    flex: 0.45,
    paddingVertical: 8,
  },
  saveButtonText: {
    fontSize: 12,
  },
  openButton: {
    flex: 0.45,
    paddingVertical: 8,
  },
  openButtonText: {
    fontSize: 12,
  },
});

export default AICard;