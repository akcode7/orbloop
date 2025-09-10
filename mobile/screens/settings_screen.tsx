import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  TextInput,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme, useThemeContext, ThemeMode } from '../themes/colors';

interface SettingsScreenProps {
  onBack?: () => void;
}

interface UserProfile {
  name: string;
  email: string;
}

interface AppPreferences {
  pushNotifications: boolean;
  autoUpdate: boolean;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const theme = useTheme();
   const { themeMode, setThemeMode, isDarkMode } = useThemeContext();
  const styles = createStyles(theme, isDarkMode);

  // State management
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'John Doe',
    email: 'john.doe@example.com'
  });
  const [originalProfile, setOriginalProfile] = useState<UserProfile>(userProfile);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [preferences, setPreferences] = useState<AppPreferences>({
    pushNotifications: true,
    autoUpdate: false,
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const savedProfile = await AsyncStorage.getItem('@user_profile');
      const savedPreferences = await AsyncStorage.getItem('@app_preferences');
      
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        setUserProfile(profile);
        setOriginalProfile(profile);
      }
      
      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const saveUserProfile = async () => {
    try {
      await AsyncStorage.setItem('@user_profile', JSON.stringify(userProfile));
      setOriginalProfile(userProfile);
      setIsEditingProfile(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    }
  };

  const cancelProfileEdit = () => {
    setUserProfile(originalProfile);
    setIsEditingProfile(false);
  };

  const savePreferences = async (newPreferences: AppPreferences) => {
    try {
      await AsyncStorage.setItem('@app_preferences', JSON.stringify(newPreferences));
      setPreferences(newPreferences);
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
  };

  const handlePreferenceChange = (key: keyof AppPreferences, value: boolean) => {
    const newPreferences = { ...preferences, [key]: value };
    savePreferences(newPreferences);
  };

  const showAppInfo = () => {
    Alert.alert(
      'About AI Tools Hub',
      'Version: 1.0.0\nBuild: 100\n\nDiscover the best AI tools for your needs. Our curated collection helps you find the perfect AI solution for productivity, creativity, development, and more.\n\n© 2024 AI Tools Hub. All rights reserved.',
      [{ text: 'OK' }]
    );
  };

  const showHelpCenter = () => {
    Alert.alert(
      'Help Center',
      'Need assistance? Here are some helpful resources:\n\n• Browse our FAQ section\n• Contact our support team\n• Visit our documentation\n• Join our community forum\n\nFor immediate support, email us at support@aitoolshub.com',
      [{ text: 'OK' }]
    );
  };

  const showPrivacyPolicy = () => {
    Alert.alert(
      'Privacy Policy',
      'We respect your privacy and are committed to protecting your personal data.\n\nKey points:\n• We only collect necessary information\n• Your data is securely stored\n• We never share your data without consent\n• You can request data deletion anytime\n\nFor full details, visit our website.',
      [{ text: 'OK' }]
    );
  };

  const showTermsOfService = () => {
    Alert.alert(
      'Terms of Service',
      'By using AI Tools Hub, you agree to our terms of service.\n\nKey terms:\n• Use the app responsibly\n• Respect intellectual property\n• No harmful or illegal activities\n• Service availability may vary\n\nFor complete terms, visit our website.',
      [{ text: 'OK' }]
    );
  };

  const renderThemeOption = (mode: ThemeMode, label: string, description: string) => (
    <TouchableOpacity
      key={mode}
      style={[
        styles.themeOption,
        themeMode === mode && styles.selectedThemeOption
      ]}
      onPress={() => handleThemeChange(mode)}
    >
      <View style={styles.themeOptionContent}>
        <Text style={styles.themeOptionTitle}>{label}</Text>
        <Text style={styles.themeOptionDescription}>{description}</Text>
      </View>
      {themeMode === mode && (
        <Text style={styles.selectedIndicator}>✓</Text>
      )}
    </TouchableOpacity>
  );

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
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>
                  {userProfile.name.split(' ').map(n => n[0]).join('')}
                </Text>
              </View>
                 <View style={styles.profileInfo}>
                {isEditingProfile ? (
                  <>
                    <TextInput
                      style={styles.profileInput}
                      value={userProfile.name}
                      onChangeText={(text) => setUserProfile({ ...userProfile, name: text })}
                      placeholder="Full Name"
                      placeholderTextColor={theme.textSecondary}
                    />
                    <View style={styles.profileInputDisabled}>
                      <Text style={styles.profileInputLabel}>Email</Text>
                      <Text style={styles.profileInputText}>{userProfile.email}</Text>
                    </View>
                  </>
                ) : (
                  <>
                    <Text style={styles.profileName}>{userProfile.name}</Text>
                    <Text style={styles.profileEmail}>{userProfile.email}</Text>
                  </>
                )}
              </View>
            </View>
            
            <View style={styles.profileActions}>
              {isEditingProfile ? (
                <>
                  <TouchableOpacity style={styles.saveButton} onPress={saveUserProfile}>
                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cancelButton} onPress={cancelProfileEdit}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity 
                  style={styles.editButton} 
                  onPress={() => setIsEditingProfile(true)}
                >
                  <Text style={styles.editButtonText}>Edit Profile</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Theme Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Theme</Text>
          <View style={styles.themeContainer}>
            {renderThemeOption('light', 'Light Mode', 'Classic light theme')}
            {renderThemeOption('dark', 'Dark Mode', 'Easy on the eyes')}
            {renderThemeOption('system', 'System Default', 'Matches device settings')}
          </View>
        </View>

        {/* App Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.preferencesCard}>
            <View style={styles.preferenceItem}>
              <View style={styles.preferenceInfo}>
                <Text style={styles.preferenceTitle}>Push Notifications</Text>
                <Text style={styles.preferenceDescription}>
                  Receive updates about new AI tools and features
                </Text>
              </View>
              <Switch
                value={preferences.pushNotifications}
                onValueChange={(value) => handlePreferenceChange('pushNotifications', value)}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor={preferences.pushNotifications ? theme.surface : theme.textSecondary}
              />
            </View>
            
            <View style={[styles.preferenceItem, styles.lastPreferenceItem]}>
              <View style={styles.preferenceInfo}>
                <Text style={styles.preferenceTitle}>Auto Update</Text>
                <Text style={styles.preferenceDescription}>
                  Automatically update app when new versions are available
                </Text>
              </View>
              <Switch
                value={preferences.autoUpdate}
                onValueChange={(value) => handlePreferenceChange('autoUpdate', value)}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor={preferences.autoUpdate ? theme.surface : theme.textSecondary}
              />
            </View>
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.supportCard}>
            <TouchableOpacity style={styles.supportItem} onPress={showHelpCenter}>
              <Text style={styles.supportIcon}>❓</Text>
              <Text style={styles.supportTitle}>Help Center</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.supportItem} onPress={showAppInfo}>
              <Text style={styles.supportIcon}>ℹ️</Text>
              <Text style={styles.supportTitle}>About Us</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.supportItem} onPress={showPrivacyPolicy}>
              <Text style={styles.supportIcon}>🔒</Text>
              <Text style={styles.supportTitle}>Privacy Policy</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.supportItem, styles.lastSupportItem]} onPress={showTermsOfService}>
              <Text style={styles.supportIcon}>📋</Text>
              <Text style={styles.supportTitle}>Terms of Service</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Information */}
        <View style={styles.section}>
          <View style={styles.appInfoCard}>
            <Text style={styles.appName}>AI Tools Hub</Text>
            <Text style={styles.appVersion}>Version 1.0.0 (Build 100)</Text>
            <Text style={styles.copyright}>© 2024 AI Tools Hub. All rights reserved.</Text>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (theme: any, isDarkMode: boolean) => StyleSheet.create({
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
    backgroundColor: theme.filterButtonBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 18,
    color: theme.text,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 12,
  },
  profileCard: {
    backgroundColor: theme.cardBackground,
    borderRadius: 16,
    padding: 20,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: theme.textSecondary,
  },
  profileInput: {
    fontSize: 16,
    color: theme.text,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    paddingVertical: 8,
    marginBottom: 8,
  },
  profileActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
 editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: isDarkMode ? '#00ff88' : theme.primary,
    borderRadius: 8,
  },
  editButtonText: {
    color: isDarkMode ? '#000000' : '#ffffff',
    fontWeight: '600',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: isDarkMode ? '#00ff88' : theme.success,
    borderRadius: 8,
  },
  saveButtonText: {
    color: isDarkMode ? '#000000' : '#ffffff',
    fontWeight: '600',
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: theme.isDarkMode ? '#333333' : theme.filterButtonBackground,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: theme.text,
    fontWeight: '600',
  },
  themeContainer: {
    backgroundColor: theme.cardBackground,
    borderRadius: 16,
    padding: 4,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginVertical: 2,
  },
  selectedThemeOption: {
    backgroundColor: theme.primary + '20',
  },
  themeOptionContent: {
    flex: 1,
  },
  themeOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 2,
  },
  themeOptionDescription: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  selectedIndicator: {
    fontSize: 18,
    color: theme.primary,
    fontWeight: 'bold',
  },
  preferencesCard: {
    backgroundColor: theme.cardBackground,
    borderRadius: 16,
    padding: 4,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  lastPreferenceItem: {
    borderBottomWidth: 0,
  },
  preferenceInfo: {
    flex: 1,
    marginRight: 16,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 2,
  },
  preferenceDescription: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  supportCard: {
    backgroundColor: theme.cardBackground,
    borderRadius: 16,
    padding: 4,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  supportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  lastSupportItem: {
    borderBottomWidth: 0,
  },
  supportIcon: {
    fontSize: 20,
    marginRight: 16,
    width: 24,
    textAlign: 'center',
  },
  supportTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: theme.text,
  },
  chevron: {
    fontSize: 18,
    color: theme.textSecondary,
    fontWeight: '300',
  },
  appInfoCard: {
    backgroundColor: theme.cardBackground,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 8,
  },
  copyright: {
    fontSize: 12,
    color: theme.textSecondary,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 40,
  },
  profileInputDisabled: {
    paddingVertical: 8,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    opacity: 0.6,
  },
  profileInputLabel: {
    fontSize: 12,
    color: theme.textSecondary,
    marginBottom: 4,
  },
  profileInputText: {
    fontSize: 16,
    color: theme.textSecondary,
  },
});

export default SettingsScreen;