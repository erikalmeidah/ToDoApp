import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createTheme } from '../styles/theme';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [theme, setTheme] = useState(createTheme(true));

  useEffect(() => {
    const loadSavedTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme) {
          const isDark = savedTheme === 'dark';
          setIsDarkMode(isDark);
          setTheme(createTheme(isDark));
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    
    loadSavedTheme();
  }, []);

  const toggleTheme = async () => {
    try {
      const newDarkMode = !isDarkMode;
      setIsDarkMode(newDarkMode);
      setTheme(createTheme(newDarkMode));
      await AsyncStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      isDarkMode, 
      toggleTheme, 
      theme: theme.styles, 
      colors: theme.colors 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};