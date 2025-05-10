import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './src/contexts/AppContext'; // Add src/
import { ThemeProvider } from './src/contexts/ThemeContext'; // Add src/
import AdminScreen from './src/screens/AdminScreen';
import HomeScreen from './src/screens/HomeScreen'; // Add src/

const Stack = createStackNavigator();

const App = () => {
  useEffect(() => {
    const resetTaskState = async () => {
      try {
        // Reset custom tasks completion status
        const savedCustomTasks = await AsyncStorage.getItem('customTasks');
        if (savedCustomTasks) {
          const customTasks = JSON.parse(savedCustomTasks);
          const resetTasks = customTasks.map(task => ({
            ...task,
            completed: false
          }));
          await AsyncStorage.setItem('customTasks', JSON.stringify(resetTasks));
        }
        
        // Clear completed tasks
        await AsyncStorage.setItem('completedTasks', JSON.stringify([]));
      } catch (error) {
        console.error('Error resetting task state:', error);
      }
    };
    
    resetTaskState();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <ThemeProvider>
            <NavigationContainer>
              <StatusBar />
              <Stack.Navigator initialRouteName="Home">
                <Stack.Screen 
                  name="Home" 
                  component={HomeScreen} 
                  options={{ headerShown: false }}
                />
                <Stack.Screen 
                  name="Admin" 
                  component={AdminScreen} 
                  options={{ title: 'Edit Tasks' }}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </ThemeProvider>
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;