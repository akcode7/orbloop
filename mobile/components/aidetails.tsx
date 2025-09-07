import React from 'react';
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
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AITool } from '../aitypes/ai_type';
import { useTheme, useIsDarkMode } from '../themes/colors';

interface AIDetailScreenProps {
  aiTool: AITool;
  onBack: () => void;
}

const AIDetailScreen: React.FC<AIDetailScreenProps> = ({
  aiTool,
  onBack,
}) => {
  const theme = useTheme();
  const isDarkMode = useIsDarkMode();
  const styles = createStyles(theme);
  
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
            </View>
          </View>

          {/* Description Section */}
          <View style={styles.descriptionSection}>
            <Text style={styles.descriptionTitle}>About</Text>
            <Text style={styles.description}>{aiTool.description}</Text>
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
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default AIDetailScreen;