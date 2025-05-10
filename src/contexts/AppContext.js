import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform } from 'react-native';
import { 
  DAILY_TASKS, 
  WEEKLY_TASKS, 
  NEW_MEDIA_TASKS 
} from '../constants/defaultTasks';
import { 
  getCurrentDay, 
  getCurrentDate, 
  getNextDay,
  filterTasksByDay,
  isWeekend
} from '../utils/dateHelpers';
import { toTitleCase } from '../utils/stringHelpers';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Day and date state
  const [selectedDay, setSelectedDay] = useState(getCurrentDay());
  const [currentDate, setCurrentDate] = useState(getCurrentDate());
  
  // Main task state
  const [dailyTasks, setDailyTasks] = useState([...DAILY_TASKS]);
  const [weeklyTasks, setWeeklyTasks] = useState([...WEEKLY_TASKS]);
  const [mediaTasks, setMediaTasks] = useState([...NEW_MEDIA_TASKS]);
  const [customTasks, setCustomTasks] = useState([]);
  const [completedTasksByDay, setCompletedTasksByDay] = useState({});
  const [reminders, setReminders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // UI state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  
  // Filtered tasks for the selected day
  const [dayTasks, setDayTasks] = useState([]);
  
  // Use a ref to track the app's last active timestamp
  const lastActiveTimestamp = useRef(Date.now());

  // Check date on app becoming active
  useEffect(() => {
    const checkDateOnActivate = () => {
      const now = Date.now();
      const lastActive = lastActiveTimestamp.current;
      lastActiveTimestamp.current = now;
      
      // If app was inactive for more than a minute, check for date change
      if (now - lastActive > 60000) {
        const newDate = getCurrentDate();
        if (newDate !== currentDate) {
          handleDateChange(newDate);
        }
      }
    };
    
    // For web, use visibilitychange event
    if (Platform.OS === 'web') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          checkDateOnActivate();
        }
      });
    }
    
    // For native, we would use AppState.addEventListener, but we'll skip that for brevity
    
    // Regular interval check as a fallback
    const intervalId = setInterval(() => {
      const newDate = getCurrentDate();
      if (newDate !== currentDate) {
        handleDateChange(newDate);
      }
    }, 60000); // Check every minute
    
    return () => {
      if (Platform.OS === 'web') {
        document.removeEventListener('visibilitychange', checkDateOnActivate);
      }
      clearInterval(intervalId);
    };
  }, [currentDate]);

  // Load saved data from AsyncStorage
  useEffect(() => {
    const loadSavedData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Load tasks
        const savedDailyTasks = await AsyncStorage.getItem('dailyTasks');
        if (savedDailyTasks) {
          setDailyTasks(JSON.parse(savedDailyTasks));
        }
        
        const savedWeeklyTasks = await AsyncStorage.getItem('weeklyTasks');
        if (savedWeeklyTasks) {
          setWeeklyTasks(JSON.parse(savedWeeklyTasks));
        }
        
        const savedMediaTasks = await AsyncStorage.getItem('mediaTasks');
        if (savedMediaTasks) {
          setMediaTasks(JSON.parse(savedMediaTasks));
        }
        
        const savedCustomTasks = await AsyncStorage.getItem('customTasks');
        if (savedCustomTasks) {
          setCustomTasks(JSON.parse(savedCustomTasks));
        }
        
        const savedCompletedTasks = await AsyncStorage.getItem('completedTasksByDay');
        if (savedCompletedTasks) {
          setCompletedTasksByDay(JSON.parse(savedCompletedTasks));
        } else {
          // Initialize with empty object if not found
          setCompletedTasksByDay({});
        }
        
        const savedReminders = await AsyncStorage.getItem('reminders');
        if (savedReminders) {
          setReminders(JSON.parse(savedReminders));
        }
      } catch (error) {
        console.error('Error loading data from AsyncStorage:', error);
        setError('Failed to load your tasks. Please try restarting the app.');
        
        // Show error alert on non-web platforms
        if (Platform.OS !== 'web') {
          Alert.alert(
            'Error',
            'Failed to load your tasks. Please try restarting the app.',
            [{ text: 'OK' }]
          );
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSavedData();
  }, []);
  
  // Update day tasks when relevant state changes
  useEffect(() => {
    const allTasks = {
      daily: dailyTasks,
      weekly: weeklyTasks,
      media: mediaTasks,
      custom: customTasks
    };
    
    // Get filtered tasks for the selected day
    const filteredTasks = filterTasksByDay(allTasks, selectedDay);
    
    // Get completed task IDs for the current day
    const completedTaskIds = (completedTasksByDay[selectedDay] || []).map(t => t.id);
    
    // Filter out already completed tasks
    const visibleTasks = filteredTasks.all.filter(
      task => !completedTaskIds.includes(task.id)
    );
    
    // Set the day's tasks
    setDayTasks(visibleTasks);
  }, [selectedDay, dailyTasks, weeklyTasks, mediaTasks, customTasks, completedTasksByDay]);
  
  const getYesterday = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return days[yesterday.getDay()];
  };
  
  // Update the handleDateChange function
  const handleDateChange = useCallback((newDate) => {
    setCurrentDate(newDate);
    
    // Get yesterday's day name
    const yesterday = getYesterday();
    
    // Remove yesterday's completed tasks
    setCompletedTasksByDay(prev => {
      const newCompleted = {...prev};
      
      // Clear yesterday's specific tasks
      delete newCompleted[yesterday];
      
      return newCompleted;
    });
    
    // Reset custom tasks for yesterday only
    setCustomTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.day === yesterday) {
          return {
            ...task,
            completed: false,
            day: getNextDay(task.day),
            date: newDate
          };
        }
        return task;
      })
    );
    
    // Save updated state
    saveCustomTasks();
    saveCompletedTasks();
  }, []);
  
  // Safe save functions with error handling
  const safeSave = async (key, data, onError) => {
    try {
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      setError(`Error saving your ${key}. Changes may not persist if you close the app.`);
      
      if (onError) onError(error);
      
      // Show error alert on non-web platforms
      if (Platform.OS !== 'web') {
        Alert.alert(
          'Save Error',
          `Error saving your ${key}. Changes may not persist if you close the app.`,
          [{ text: 'OK' }]
        );
      }
    }
  };
  
  // Save functions
  const saveDailyTasks = useCallback(() => {
    safeSave('dailyTasks', dailyTasks);
  }, [dailyTasks]);
  
  const saveWeeklyTasks = useCallback(() => {
    safeSave('weeklyTasks', weeklyTasks);
  }, [weeklyTasks]);
  
  const saveMediaTasks = useCallback(() => {
    safeSave('mediaTasks', mediaTasks);
  }, [mediaTasks]);
  
  const saveCustomTasks = useCallback(() => {
    safeSave('customTasks', customTasks);
  }, [customTasks]);
  
  const saveCompletedTasks = useCallback(() => {
    safeSave('completedTasksByDay', completedTasksByDay);
  }, [completedTasksByDay]);
  
  const saveReminders = useCallback(() => {
    safeSave('reminders', reminders);
  }, [reminders]);
  
  // Effect to save tasks when they change
  useEffect(() => {
    if (!isLoading) saveDailyTasks();
  }, [dailyTasks, saveDailyTasks, isLoading]);
  
  useEffect(() => {
    if (!isLoading) saveWeeklyTasks();
  }, [weeklyTasks, saveWeeklyTasks, isLoading]);
  
  useEffect(() => {
    if (!isLoading) saveMediaTasks();
  }, [mediaTasks, saveMediaTasks, isLoading]);
  
  useEffect(() => {
    if (!isLoading) saveCustomTasks();
  }, [customTasks, saveCustomTasks, isLoading]);
  
  useEffect(() => {
    if (!isLoading) saveCompletedTasks();
  }, [completedTasksByDay, saveCompletedTasks, isLoading]);
  
  useEffect(() => {
    if (!isLoading) saveReminders();
  }, [reminders, saveReminders, isLoading]);
  
  // Day selection
  const selectDay = useCallback((day) => {
    setSelectedDay(day);
    setIsSidebarOpen(false);
  }, []);
  
  // Task actions
  const completeTask = useCallback((taskId) => {
    // Find the task
    const task = dayTasks.find(t => t.id === taskId);
    
    if (task) {
      // Add to completed tasks for the current day
      setCompletedTasksByDay(prev => {
        const dayCompleted = prev[selectedDay] || [];
        return {
          ...prev,
          [selectedDay]: [...dayCompleted, { id: task.id, text: task.text, type: task.type }]
        };
      });
      
      // If it's a custom task, mark it as completed
      if (task.type === 'custom') {
        setCustomTasks(prev => 
          prev.map(t => t.id === taskId ? { ...t, completed: true } : t)
        );
      }
      
      // Remove from current day's task list view
      setDayTasks(prev => prev.filter(t => t.id !== taskId));
    }
  }, [dayTasks, selectedDay]);
  
  const clearCompletedTasks = useCallback(() => {
    // Only clear completed tasks for the current day
    setCompletedTasksByDay(prev => {
      const newCompletedTasks = {...prev};
      delete newCompletedTasks[selectedDay];
      return newCompletedTasks;
    });
  }, [selectedDay]);
  
  const addCustomTask = useCallback((text) => {
    if (!text.trim()) return;
    
    // Create a new custom task
    const newTask = {
      id: `c${Date.now()}`,
      text: toTitleCase(text),
      completed: false,
      day: selectedDay,
      date: currentDate,
      type: 'custom',
    };
    
    // Add to custom tasks array
    setCustomTasks(prev => [...prev, newTask]);
    
    // IMPORTANT: When adding a task, only add the NEW task to dayTasks
    // Do NOT refresh the entire list, which would bring back completed tasks
    setDayTasks(prev => {
      // Only add the new task without refreshing the entire list
      return [...prev, newTask];
    });
  }, [selectedDay, currentDate]);
  
  // Reminder actions with cleanup for animation values
  const reminderAnimations = useRef({});
  
  const addReminder = useCallback((text) => {
    if (!text.trim()) return;
    
    const newReminder = {
      id: `r${Date.now()}`,
      text: toTitleCase(text),
      completed: false,
    };
    
    setReminders(prev => [...prev, newReminder]);
  }, []);
  
  const toggleReminder = useCallback((id) => {
    setReminders(prev => 
      prev.map(reminder =>
        reminder.id === id 
          ? { ...reminder, completed: !reminder.completed } 
          : reminder
      )
    );
    
    // Clean up animation value if exists
    if (reminderAnimations.current[id]) {
      delete reminderAnimations.current[id];
    }
  }, []);
  
  const clearReminders = useCallback(() => {
    setReminders([]);
    // Clean up all animation values
    reminderAnimations.current = {};
  }, []);
  
  // Admin actions
  const addTaskToArray = useCallback((text, arrayType, day = null) => {
    if (!text.trim()) return;
    
    const newTask = {
      id: `${arrayType[0]}${Date.now()}`,
      text: toTitleCase(text),
      completed: false,
      type: arrayType,
    };
    
    if (arrayType !== 'daily') {
      newTask.day = day;
    }
    
    switch(arrayType) {
      case 'daily':
        setDailyTasks(prev => [...prev, newTask]);
        break;
      case 'weekly':
        setWeeklyTasks(prev => [...prev, newTask]);
        break;
      case 'media':
        setMediaTasks(prev => [...prev, newTask]);
        break;
    }
  }, []);
  
  const removeTaskFromArray = useCallback((id, arrayType) => {
    switch(arrayType) {
      case 'daily':
        setDailyTasks(prev => prev.filter(task => task.id !== id));
        break;
      case 'weekly':
        setWeeklyTasks(prev => prev.filter(task => task.id !== id));
        break;
      case 'media':
        setMediaTasks(prev => prev.filter(task => task.id !== id));
        break;
    }
  }, []);
  
  // UI actions
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);
  
  const toggleAdminModal = useCallback(() => {
    setIsAdminModalOpen(prev => !prev);
  }, []);
  
  // Improved reorderTasks with better error handling and validation
  const reorderTasks = useCallback((fromGroup, fromIndex, toGroup, toIndex) => {
    // Only allow reordering within the same group
    if (fromGroup !== toGroup) return;
    
    // Get a copy of the current tasks by type
    const tasksByType = {
      daily: [...dailyTasks],
      weekly: [...weeklyTasks],
      media: [...mediaTasks],
      custom: [...customTasks]
    };
    
    // Get the tasks for the specific group
    const groupTasks = tasksByType[fromGroup];
    
    // Validate indices
    if (!groupTasks) {
      console.error(`Invalid group: ${fromGroup}`);
      return;
    }
    
    if (fromIndex < 0 || fromIndex >= groupTasks.length) {
      console.error(`Invalid fromIndex: ${fromIndex} for group with length ${groupTasks.length}`);
      return;
    }
    
    if (toIndex < 0 || toIndex >= groupTasks.length) {
      console.error(`Invalid toIndex: ${toIndex} for group with length ${groupTasks.length}`);
      // Clamp to valid range
      toIndex = Math.max(0, Math.min(toIndex, groupTasks.length - 1));
    }
    
    // If indices are the same, no reordering needed
    if (fromIndex === toIndex) return;
    
    try {
      // Reorder the tasks in the group
      const [taskToMove] = groupTasks.splice(fromIndex, 1);
      groupTasks.splice(toIndex, 0, taskToMove);
      
      // Update the appropriate state based on the group type
      switch (fromGroup) {
        case 'daily':
          setDailyTasks(groupTasks);
          break;
        case 'weekly':
          setWeeklyTasks(groupTasks);
          break;
        case 'media':
          setMediaTasks(groupTasks);
          break;
        case 'custom':
          setCustomTasks(groupTasks);
          break;
        default:
          break;
      }
      
      // Also update the dayTasks for immediate UI update
      // This is important for consistent behavior across platforms
      const filteredTasks = dayTasks.filter(task => task.type !== fromGroup);
      const reorderedGroupTasks = groupTasks.filter(task => {
        // For weekly, media tasks, only include tasks for the selected day
        if (task.type === 'daily') return !(task.skipWeekends && isWeekend(selectedDay));
        if (task.type === 'weekly' || task.type === 'media') return task.day === selectedDay;
        if (task.type === 'custom') return task.day === selectedDay && !task.completed;
        return false;
      });
      
      setDayTasks([...filteredTasks, ...reorderedGroupTasks]);
    } catch (error) {
      console.error('Error during task reordering:', error);
    }
  }, [dailyTasks, weeklyTasks, mediaTasks, customTasks, dayTasks, selectedDay]);
  
  // Context value
  const contextValue = {
    // Day and tasks
    selectedDay,
    selectDay,
    dayTasks,
    completedTasksByDay,
    
    // Task actions
    completeTask,
    clearCompletedTasks,
    addCustomTask,
    reorderTasks,
    
    // Reminders
    reminders,
    addReminder,
    toggleReminder,
    clearReminders,
    
    // Admin
    dailyTasks,
    weeklyTasks,
    mediaTasks,
    addTaskToArray,
    removeTaskFromArray,
    
    // UI
    isSidebarOpen,
    toggleSidebar,
    isAdminModalOpen,
    toggleAdminModal,
    
    // Status
    isLoading,
    error
  };
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};