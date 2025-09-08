import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, useIsDarkMode } from '../themes/colors';
import Button from '../components/buttons';



interface OnboardingScreenProps {
  onLogin?: () => void;
  onSignup?: () => void;
  onSkip?: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onLogin,
  onSignup,
  onSkip,
}) => {
  const theme = useTheme();
  const isDarkMode = useIsDarkMode();
  const styles = createStyles(theme);

  const handleLogin = () => {
    console.log('Login button pressed');
    onLogin?.();
  };

  const handleSignup = () => {
    console.log('Signup button pressed');
    onSignup?.();
  };

  const handleSkip = () => {
    console.log('Skip button pressed');
    onSkip?.();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={theme.background} 
      />
      
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome to</Text>
        <Text style={styles.appTitle}>AI Tools Hub</Text>
        <Text style={styles.subtitle}>
          Discover the best AI tools for your needs
        </Text>
      </View>

      {/* Illustration Section */}
      <View style={styles.illustrationContainer}>
        <View style={styles.illustrationPlaceholder}>
          <Text style={styles.illustrationEmoji}>🤖</Text>
          <Text style={styles.illustrationText}>AI Tools</Text>
        </View>
      </View>

      {/* Features Section */}
      <View style={styles.featuresContainer}>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>🔍</Text>
          <Text style={styles.featureText}>Discover AI Tools</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>⭐</Text>
          <Text style={styles.featureText}>Save Favorites</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>🔥</Text>
          <Text style={styles.featureText}>Trending Updates</Text>
        </View>
      </View>

      {/* Action Buttons Section */}
      <View style={styles.actionContainer}>
        <Button
          title="Sign Up"
          onPress={handleSignup}
          variant="primary"
          size="large"
          style={styles.signupButton}
          icon="👤"
        />
        
        <Button
          title="Log In"
          onPress={handleLogin}
          variant="outline"
          size="large"
          style={styles.loginButton}
          icon="🔐"
        />
        
        <Button
          title="Skip for now"
          onPress={handleSkip}
          variant="secondary"
          size="medium"
          style={styles.skipButton}
        />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By continuing, you agree to our Terms & Privacy Policy
        </Text>
      </View>
    </SafeAreaView>
  );
};

const createStyles = (theme: any) => {
  const { width, height } = Dimensions.get('window');
  
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingHorizontal: 24,
    },
    header: {
      alignItems: 'center',
      paddingTop: 40,
      paddingBottom: 20,
    },
    welcomeText: {
      fontSize: 18,
      color: theme.textSecondary,
      fontWeight: '400',
      marginBottom: 8,
    },
    appTitle: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 12,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
      paddingHorizontal: 20,
    },
    illustrationContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 40,
    },
    illustrationPlaceholder: {
      width: 200,
      height: 200,
      backgroundColor: theme.cardBackground,
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    illustrationEmoji: {
      fontSize: 80,
      marginBottom: 12,
    },
    illustrationText: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.text,
    },
    featuresContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 30,
      paddingHorizontal: 20,
    },
    featureItem: {
      alignItems: 'center',
      flex: 1,
    },
    featureIcon: {
      fontSize: 24,
      marginBottom: 8,
    },
    featureText: {
      fontSize: 12,
      color: theme.textSecondary,
      textAlign: 'center',
      fontWeight: '500',
    },
    actionContainer: {
      paddingBottom: 20,
      gap: 16,
    },
    signupButton: {
      marginBottom: 4,
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    loginButton: {
      marginBottom: 4,
    },
    skipButton: {
      marginTop: 8,
      alignSelf: 'center',
      paddingHorizontal: 32,
    },
    footer: {
      paddingBottom: 30,
      alignItems: 'center',
    },
    footerText: {
      fontSize: 12,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 18,
      paddingHorizontal: 40,
    },
  });
};

export default OnboardingScreen;