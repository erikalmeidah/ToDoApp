import { StyleSheet, Platform } from 'react-native';

export const createTheme = (isDark) => {
  const colors = {
    background: isDark ? '#1e1e1e' : '#f5f5f5',
    backgroundGradientStart: isDark ? '#1e1e1e' : '#f5f5f5',
    backgroundGradientEnd: isDark ? '#2a2a2a' : '#e0e0e0',
    surface: isDark ? '#2e2e2e' : '#ffffff',
    surfaceAlt: isDark ? '#252525' : '#e0e0e0',
    primary: '#3b5998',
    primaryDark: '#2a4373',
    primaryActive: '#1c2b4a',
    text: isDark ? '#e0e0e0' : '#333333',
    textSecondary: isDark ? '#888888' : '#666666',
    border: isDark ? '#444444' : '#cccccc',
    danger: '#ff4444',
    dangerDark: '#cc0000',
    shadow: isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)',
    modalOverlay: 'rgba(0, 0, 0, 0.5)',
  };

  // Create platform-specific shadow styles
  const createShadowStyle = (elevation) => {
    if (Platform.OS === 'ios' || Platform.OS === 'web') {
      return {
        shadowColor: isDark ? '#000' : 'rgba(0, 0, 0, 0.1)',
        shadowOffset: { width: 0, height: elevation },
        shadowOpacity: isDark ? 0.2 : 0.1,
        shadowRadius: elevation,
      };
    } else {
      return {
        elevation: elevation,
      };
    }
  };

  // Base styles that work across platforms
  const baseStyles = {
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    darkContainer: {
      backgroundColor: colors.background,
    },
    lightContainer: {
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
    },
    mainContent: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    tasksSection: {
      flex: 1,
    },
    rightSection: {
      marginTop: 20,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 15,
      backgroundColor: colors.surfaceAlt,
      ...createShadowStyle(2),
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
      flex: 1,
    },
    headerControls: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    adminButton: {
      width: 67,
      height: 36,
      backgroundColor: colors.primary,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
    adminButtonText: {
      color: '#fff',
      fontSize: 12,
    },
    themeToggle: {
      width: 50,
      height: 36,
      backgroundColor: isDark ? '#444' : colors.primary,
      borderRadius: 24,
      justifyContent: 'center',
      paddingHorizontal: 2,
    },
    themeToggleCircle: {
      width: 20,
      height: 20,
      backgroundColor: '#e0e0e0',
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    themeIcon: {
      fontSize: 12,
    },
    sandwichButton: {
      width: 67,
      height: 36,
      justifyContent: 'center',
      alignItems: 'center',
    },
    sandwichIcon: {
      color: colors.text,
      fontSize: 20,
    },
    // Additional styles for components
    sectionHeader: {
      fontSize: 20,
      fontWeight: '500',
      marginVertical: 15,
      color: colors.text,
    },
    taskContainer: {
      width: '100%',
    },
    taskItem: {
      padding: 12,
      backgroundColor: colors.surface,
      borderRadius: 8,
      marginVertical: 5,
      ...createShadowStyle(2),
    },
    taskText: {
      color: colors.text,
    },
    inputContainer: {
      marginTop: 20,
      width: '100%',
    },
    input: {
      width: '100%',
      padding: 12,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      backgroundColor: isDark ? '#3e3e3e' : '#fff',
      color: colors.text,
      fontSize: 16,
    },
    button: {
      width: '100%',
      padding: 12,
      backgroundColor: colors.primary,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 10,
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 16,
    },
    // Sidebar styles
    sidebar: {
      position: 'absolute',
      top: 0,
      left: -250,
      width: 250,
      height: '100%',
      backgroundColor: isDark ? '#2e2e2e' : '#fff',
      justifyContent: 'center',
      zIndex: 200,
      ...createShadowStyle(5),
    },
    sidebarOpen: {
      left: 0,
    },
    dayPicker: {
      padding: 25,
    },
    dayButton: {
      width: 200,
      padding: 12,
      marginVertical: 5,
      backgroundColor: colors.primary,
      borderRadius: 8,
      alignItems: 'center',
    },
    dayButtonText: {
      color: '#fff',
      fontSize: 16,
    },
    activeDay: {
      backgroundColor: colors.primaryActive,
      fontWeight: 'bold',
    },
    // CompletedTasks and Reminders styles
    completedToday: {
      backgroundColor: colors.surfaceAlt,
      borderRadius: 8,
      padding: 15,
      width: '100%',
      ...createShadowStyle(2),
      marginBottom: 20,
    },
    completedTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 10,
      color: colors.text,
    },
    completedList: {
      width: '100%',
    },
    completedItem: {
      padding: 10,
      backgroundColor: colors.surface,
      borderRadius: 8,
      marginVertical: 5,
      color: colors.text,
      textDecorationLine: 'line-through',
      textDecorationColor: 'green',
    },
    remindersSection: {
      backgroundColor: colors.surfaceAlt,
      borderRadius: 8,
      padding: 15,
      width: '100%',
      ...createShadowStyle(2),
    },
    remindersTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 10,
      color: colors.text,
    },
    reminderItem: {
      padding: 10,
      backgroundColor: colors.surface,
      borderRadius: 8,
      marginVertical: 5,
      color: colors.text,
    },
    reminderCompleted: {
      textDecorationLine: 'line-through',
      textDecorationColor: 'green',
      opacity: 0.7,
    },
    // Modal styles
    modal: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.modalOverlay,
    },
    modalContent: {
      backgroundColor: colors.surface,
      padding: 20,
      borderRadius: 8,
      width: '80%',
      maxWidth: 500,
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginTop: 0,
      color: colors.text,
    },
    modalSelect: {
      width: '100%',
      padding: 10,
      marginBottom: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: isDark ? '#3e3e3e' : '#fff',
      color: colors.text,
    },
    modalInput: {
      width: '100%',
      padding: 10,
      marginBottom: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: isDark ? '#3e3e3e' : '#fff',
      color: colors.text,
    },
    modalList: {
      width: '100%',
    },
    modalItem: {
      padding: 10,
      backgroundColor: isDark ? '#3e3e3e' : '#f5f5f5',
      borderRadius: 8,
      marginVertical: 5,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    modalItemText: {
      color: colors.text,
    },
    deleteButton: {
      padding: 5,
      fontSize: 14,
      backgroundColor: colors.danger,
      borderRadius: 4,
      minWidth: 30,
      alignItems: 'center',
      justifyContent: 'center',
    },
    deleteButtonText: {
      color: '#fff',
    },
    actionButton: {
      width: '100%',
      padding: 12,
      backgroundColor: colors.primary,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 10,
    },
    actionButtonText: {
      color: '#fff',
      fontSize: 16,
    },
  };

  // Web-specific styles
  if (Platform.OS === 'web') {
    // Add boxShadow to elements that need shadow on web
    const webSpecificStyles = {
          container: {
        ...baseStyles.container,
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      },
      scrollView: {
        ...baseStyles.scrollView,
        flex: 1,
        overflow: 'auto',
      },
      header: {
        ...baseStyles.header,
        boxShadow: isDark ? '0 2px 4px rgba(0, 0, 0, 0.2)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      taskItem: {
        ...baseStyles.taskItem,
        boxShadow: isDark ? '0 3px 6px rgba(0, 0, 0, 0.2)' : '0 3px 6px rgba(0, 0, 0, 0.1)',
      },
      completedToday: {
        ...baseStyles.completedToday,
        boxShadow: isDark ? '0 3px 6px rgba(0, 0, 0, 0.2)' : '0 3px 6px rgba(0, 0, 0, 0.1)',
      },
      remindersSection: {
        ...baseStyles.remindersSection,
        boxShadow: isDark ? '0 3px 6px rgba(0, 0, 0, 0.2)' : '0 3px 6px rgba(0, 0, 0, 0.1)',
      },
      sidebar: {
        ...baseStyles.sidebar,
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
      },
      // Add transform for web slider/toggle  
      themeToggleCircle: {
        ...baseStyles.themeToggleCircle,
        transform: isDark ? 'translateX(0)' : 'translateX(26px)',
      },
    };
    
    return {
      colors,
      styles: StyleSheet.create({
        ...baseStyles,
        ...webSpecificStyles
      }),
    };
  }

  return {
    colors,
    styles: StyleSheet.create(baseStyles),
  };
};