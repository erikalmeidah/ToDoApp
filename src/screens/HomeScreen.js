import { useContext, useEffect, useState } from 'react';
import { Dimensions, Platform, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import CompletedTasks from '../components/CompletedTasks';
import Header from '../components/Header';
import Reminders from '../components/Reminders';
import Sidebar from '../components/Sidebar';
import TaskList from '../components/TaskList';
import { AppContext } from '../contexts/AppContext';
import { ThemeContext } from '../contexts/ThemeContext';

// Separate Web HomeScreen Implementation
const WebHomeScreen = ({ 
  selectedDay, 
  dayTasks, 
  completedTasksByDay, 
  reminders, 
  isDarkMode, 
  theme, 
  onTaskComplete, 
  onAddCustomTask, 
  onReorderTasks, 
  onClearCompleted, 
  onToggleReminder, 
  onAddReminder, 
  onClearReminders,
  windowWidth 
}) => {
  const useColumnLayout = windowWidth >= 1024;
  
  // Force document and html to have 100% height
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.style.height = '100%';
      document.body.style.height = '100%';
      document.body.style.margin = '0';
      document.getElementById('root').style.height = '100%';
      document.getElementById('root').style.display = 'flex';
      document.getElementById('root').style.flexDirection = 'column';
    }
  }, []);
  
  return (
    <div 
      style={{ 
        flex: 1,
        display: 'flex', 
        flexDirection: 'column',
        height: 'calc(100vh - 65px)', // Adjust for header height
        overflow: 'auto',
        backgroundColor: isDarkMode ? '#1e1e1e' : '#f5f5f5'
      }}
    >
      <div
        style={{
          padding: '20px',
          display: 'flex',
          flexDirection: useColumnLayout ? 'row' : 'column',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        <div
          style={{
            width: useColumnLayout ? '65%' : '100%',
            paddingRight: useColumnLayout ? '20px' : '0'
          }}
        >
          <TaskList 
            dayTasks={dayTasks} 
            selectedDay={selectedDay}
            onTaskComplete={onTaskComplete}
            onAddCustomTask={onAddCustomTask}
            onReorderTasks={onReorderTasks}
            isDarkMode={isDarkMode}
          />
        </div>
        
        <div
          style={{
            width: useColumnLayout ? '35%' : '100%',
            marginTop: useColumnLayout ? '0' : '20px'
          }}
        >
          <CompletedTasks 
            completedTasks={completedTasksByDay[selectedDay] || []} 
            onClearCompleted={onClearCompleted}
            isDarkMode={isDarkMode}
          />
          
          <Reminders 
            reminders={reminders}
            onToggleReminder={onToggleReminder}
            onAddReminder={onAddReminder}
            onClearReminders={onClearReminders}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>
    </div>
  );
};

// Main HomeScreen component that selects the appropriate implementation
const HomeScreen = ({ navigation }) => {
  const {
    selectedDay,
    selectDay,
    dayTasks,
    completedTasksByDay,
    completeTask,
    clearCompletedTasks,
    addCustomTask,
    reorderTasks,
    reminders,
    addReminder,
    toggleReminder,
    clearReminders,
    isSidebarOpen,
    toggleSidebar,
  } = useContext(AppContext);

  const { isDarkMode, toggleTheme, theme } = useContext(ThemeContext);
  const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);
  const [windowHeight, setWindowHeight] = useState(Dimensions.get('window').height);

  // Update window dimensions when they change
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setWindowWidth(window.width);
      setWindowHeight(window.height);
    });
    return () => subscription.remove();
  }, []);

  // Handle admin navigation
  const handleOpenAdmin = () => {
    navigation.navigate('Admin');
  };

  // Determine if we're running on web
  const isWeb = Platform.OS === 'web';

  return (
    <SafeAreaView style={[
      theme.container,
      isDarkMode ? theme.darkContainer : theme.lightContainer,
      isWeb && { height: '100%' },
      Platform.OS === 'android' && { paddingTop: StatusBar.currentHeight }
    ]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#1e1e1e' : '#f5f5f5'}
        translucent={true}
      />
      
      <Header 
        title="Daily To-Do List" 
        toggleSidebar={toggleSidebar} 
        openAdminModal={handleOpenAdmin}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />
      
      <Sidebar 
        isOpen={isSidebarOpen}
        selectedDay={selectedDay}
        onSelectDay={selectDay}
        onClose={toggleSidebar}
        isDarkMode={isDarkMode}
      />

      {isWeb ? (
        // Web version uses pure HTML/CSS
        <WebHomeScreen 
          selectedDay={selectedDay}
          dayTasks={dayTasks}
          completedTasksByDay={completedTasksByDay}
          reminders={reminders}
          isDarkMode={isDarkMode}
          theme={theme}
          onTaskComplete={completeTask}
          onAddCustomTask={addCustomTask}
          onReorderTasks={reorderTasks}
          onClearCompleted={clearCompletedTasks}
          onToggleReminder={toggleReminder}
          onAddReminder={addReminder}
          onClearReminders={clearReminders}
          windowWidth={windowWidth}
        />
      ) : (
        // Mobile version with React Native ScrollView
          <View style={theme.mainContent}>
            <TaskList 
              dayTasks={dayTasks} 
              selectedDay={selectedDay}
              onTaskComplete={completeTask}
              onAddCustomTask={addCustomTask}
              onReorderTasks={reorderTasks}
              isDarkMode={isDarkMode}
              // Pass components and props for footer
              completedTasksProps={{
                completedTasks: completedTasksByDay[selectedDay] || [],
                onClearCompleted: clearCompletedTasks,
                isDarkMode
              }}
              remindersProps={{
                reminders,
                onToggleReminder: toggleReminder,
                onAddReminder: addReminder,
                onClearReminders: clearReminders,
                isDarkMode
              }}
            />
          </View>
      )}
    </SafeAreaView>
  );
};

// Mobile styles
const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  columnRightSection: {
    width: '100%',
    marginTop: 20,
  },
});

export default HomeScreen;