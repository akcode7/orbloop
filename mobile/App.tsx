import React, { useState, useEffect } from 'react';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AIListingScreen from './screens/all_listingscr';
import OnboardingScreen from './screens/onboarding_scr';
import LoginScreen from './screens/auth/login';
import RegisterScreen from './screens/auth/signup';
import HomeScreen from './screens/home_screen';
import SavedAIToolsScreen from './screens/saved_items';
import AIDetailScreen from './components/aidetails';
import SettingsScreen from './screens/settings_screen';
import LearnAIScreen from './screens/learn_ai';
import LearnAIDetailedScreen from './screens/learn_ai_detailed';
import { ThemeProvider } from './themes/colors';
import { AITool } from './aitypes/ai_type';
import { Course } from './aitypes/course_type';

const ONBOARDING_COMPLETED_KEY = '@onboarding_completed';

type Screen = 'onboarding' | 'login' | 'signup' | 'home' | 'allListings' | 'saved' | 'detail' | 'settings' | 'learn' | 'learnDetail';



function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAI, setSelectedAI] = useState<AITool | null>(null);
  const [savedTools, setSavedTools] = useState<AITool[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    checkOnboardingStatus();
    loadSavedTools();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const onboardingCompleted = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);
      if (onboardingCompleted === 'true') {
        setCurrentScreen('home');
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSavedTools = async () => {
    try {
      const saved = await AsyncStorage.getItem('@saved_tools');
      if (saved) {
        setSavedTools(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading saved tools:', error);
    }
  };

  const markOnboardingCompleted = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
      setCurrentScreen('home');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      // Still navigate to home even if saving fails
      setCurrentScreen('home');
    }
  };

  const handleSkipOnboarding = () => {
    markOnboardingCompleted();
  };

  const handleLogin = () => {
    setCurrentScreen('login');
  };

  const handleSignup = () => {
    setCurrentScreen('signup');
  };

  const handleBackToOnboarding = () => {
    setCurrentScreen('onboarding');
  };

  const handleLoginSuccess = () => {
    markOnboardingCompleted();
  };

  const handleSignupSuccess = () => {
    markOnboardingCompleted();
  };

  const handleNavigateToSignup = () => {
    setCurrentScreen('signup');
  };

  const handleNavigateToLogin = () => {
    setCurrentScreen('login');
  };

  // Navigation handlers for main app
  const handleNavigateToAllListings = () => {
    setCurrentScreen('allListings');
  };

  const handleNavigateToSaved = () => {
    setCurrentScreen('saved');
  };

  const handleNavigateToSettings = () => {
    setCurrentScreen('settings');
  };

   const handleNavigateToLearn = () => {
    setCurrentScreen('learn');
  };

  const handleNavigateToDetail = (tool: AITool) => {
    setSelectedAI(tool);
    setCurrentScreen('detail');
  };

  const handleNavigateToCourse = (course: Course) => {
    setSelectedCourse(course);
    setCurrentScreen('learnDetail');
  };

  const handleNavigateToHome = () => {
    setCurrentScreen('home');
  };

  const handleSaveTool = async (tool: AITool) => {
    try {
      const isAlreadySaved = savedTools.some(saved => saved.id === tool.id);
      let newSavedTools;
      
      if (isAlreadySaved) {
        newSavedTools = savedTools.filter(saved => saved.id !== tool.id);
      } else {
        newSavedTools = [...savedTools, tool];
      }
      
      setSavedTools(newSavedTools);
      await AsyncStorage.setItem('@saved_tools', JSON.stringify(newSavedTools));
    } catch (error) {
      console.error('Error saving tool:', error);
    }
  };

  // Show loading screen while checking onboarding status
  if (isLoading) {
    return <SafeAreaProvider><ThemeProvider><></></ThemeProvider></SafeAreaProvider>;
  }

  if (currentScreen === 'onboarding') {
    return (
      <SafeAreaProvider>
        <ThemeProvider>
          <OnboardingScreen 
            onLogin={handleLogin}
            onSignup={handleSignup}
            onSkip={handleSkipOnboarding}
          />
        </ThemeProvider>
      </SafeAreaProvider>
    );
  }

  if (currentScreen === 'login') {
    return (
      <SafeAreaProvider>
        <ThemeProvider>
          <LoginScreen
            onLoginSuccess={handleLoginSuccess}
            onNavigateToSignup={handleNavigateToSignup}
            onBack={handleBackToOnboarding}
          />
        </ThemeProvider>
      </SafeAreaProvider>
    );
  }

  if (currentScreen === 'signup') {
    return (
      <SafeAreaProvider>
        <ThemeProvider>
          <RegisterScreen
            onRegisterSuccess={handleSignupSuccess}
            onNavigateToLogin={handleNavigateToLogin}
            onBack={handleBackToOnboarding}
          />
        </ThemeProvider>
      </SafeAreaProvider>
    );
  }

  if (currentScreen === 'home') {
    return (
      <SafeAreaProvider>
        <ThemeProvider>
          <HomeScreen
            onNavigateToAllListings={handleNavigateToAllListings}
            onNavigateToDetail={handleNavigateToDetail}
            onSaveTool={handleSaveTool}
            onNavigateToSaved={handleNavigateToSaved}
            onNavigateToProfile={handleNavigateToSettings}
            onNavigateToLearn={handleNavigateToLearn}
            savedTools={savedTools}
          />
        </ThemeProvider>
      </SafeAreaProvider>
    );
  }
  
if (currentScreen === 'allListings') {
    return (
      <SafeAreaProvider>
        <ThemeProvider>
          <AIListingScreen 
            onNavigateToHome={handleNavigateToHome}
            onNavigateToSaved={handleNavigateToSaved}
            onNavigateToSettings={handleNavigateToSettings}
            onNavigateToLearn={handleNavigateToLearn}
          />
        </ThemeProvider>
      </SafeAreaProvider>
    );
  }

  if (currentScreen === 'saved') {
    return (
      <SafeAreaProvider>
        <ThemeProvider>
          <SavedAIToolsScreen 
            onBack={handleNavigateToHome}
            onNavigateToHome={handleNavigateToHome}
            onNavigateToExplore={handleNavigateToAllListings}
            onNavigateToLearn={handleNavigateToLearn}
          />
        </ThemeProvider>
      </SafeAreaProvider>
    );
  }

   if (currentScreen === 'settings') {
    return (
      <SafeAreaProvider>
        <ThemeProvider>
          <SettingsScreen 
            onBack={handleNavigateToHome}
          />
        </ThemeProvider>
      </SafeAreaProvider>
    );
  }

  if (currentScreen === 'learn') {
    return (
      <SafeAreaProvider>
        <ThemeProvider>
          <LearnAIScreen
            onNavigateToHome={handleNavigateToHome}
            onNavigateToExplore={handleNavigateToAllListings}
            onNavigateToSaved={handleNavigateToSaved}
            onNavigateToCourse={handleNavigateToCourse}
          />
        </ThemeProvider>
      </SafeAreaProvider>
    );
  }

  if (currentScreen === 'learnDetail' && selectedCourse) {
    return (
      <SafeAreaProvider>
        <ThemeProvider>
          <LearnAIDetailedScreen
            course={selectedCourse}
            onBack={() => setCurrentScreen('learn')}
          />
        </ThemeProvider>
      </SafeAreaProvider>
    );
  }

  if (currentScreen === 'detail' && selectedAI) {
    return (
      <SafeAreaProvider>
        <ThemeProvider>
          <AIDetailScreen
            aiTool={selectedAI}
            onBack={handleNavigateToHome}
          />
        </ThemeProvider>
      </SafeAreaProvider>
    );
  }

  // Fallback to home
  return (
    <SafeAreaProvider>
      <ThemeProvider>
         <HomeScreen
          onNavigateToAllListings={handleNavigateToAllListings}
          onNavigateToDetail={handleNavigateToDetail}
          onSaveTool={handleSaveTool}
          onNavigateToSaved={handleNavigateToSaved}
          onNavigateToProfile={handleNavigateToSettings}
          onNavigateToLearn={handleNavigateToLearn}
          savedTools={savedTools}
        />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;