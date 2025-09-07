import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import AIListingScreen from './screens/all_listingscr';

function App() {
  return (
    <SafeAreaProvider>
      <AIListingScreen />
    </SafeAreaProvider>
  );
}

export default App;
// ... existing code ...