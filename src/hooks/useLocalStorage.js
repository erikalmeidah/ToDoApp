import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

/**
 * Custom hook for handling data persistence with AsyncStorage
 * @param {string} key - Storage key
 * @param {any} initialValue - Default value if none stored
 * @returns {Array} [storedValue, setValue] - Current value and setter function
 */
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from AsyncStorage
  useEffect(() => {
    const loadData = async () => {
      try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
          setStoredValue(JSON.parse(value));
        }
        setIsLoading(false);
      } catch (error) {
        console.error(`Error loading ${key} from storage:`, error);
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [key]);

  // Store updated value to AsyncStorage
  const setValue = async (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      await AsyncStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error saving ${key} to storage:`, error);
    }
  };

  return [storedValue, setValue, isLoading];
};

export default useLocalStorage;