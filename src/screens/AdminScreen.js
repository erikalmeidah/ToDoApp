import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  SafeAreaView, 
  StyleSheet 
} from 'react-native';
import { ThemeContext } from '../contexts/ThemeContext';
import { AppContext } from '../contexts/AppContext';
import AdminModal from '../components/AdminModal';

const AdminScreen = ({ navigation }) => {
  const { isDarkMode, theme } = useContext(ThemeContext);
  const { 
    dailyTasks, 
    weeklyTasks, 
    mediaTasks,
    addTaskToArray,
    removeTaskFromArray 
  } = useContext(AppContext);

  useEffect(() => {
    // Close screen and return to Home when modal is dismissed
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      navigation.navigate('Home');
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={[
      styles.container,
      isDarkMode ? styles.darkContainer : styles.lightContainer
    ]}>
      <View style={styles.modalContainer}>
        <AdminModal 
          visible={true}
          closeModal={() => navigation.goBack()}
          dailyTasks={dailyTasks}
          weeklyTasks={weeklyTasks}
          mediaTasks={mediaTasks}
          updateDailyTasks={(tasks) => {
            tasks.forEach(task => {
              if (!dailyTasks.find(t => t.id === task.id)) {
                addTaskToArray(task.text, 'daily');
              }
            });
          }}
          updateWeeklyTasks={(tasks) => {
            tasks.forEach(task => {
              if (!weeklyTasks.find(t => t.id === task.id)) {
                addTaskToArray(task.text, 'weekly', task.day);
              }
            });
          }}
          updateMediaTasks={(tasks) => {
            tasks.forEach(task => {
              if (!mediaTasks.find(t => t.id === task.id)) {
                addTaskToArray(task.text, 'media', task.day);
              }
            });
          }}
          removeTask={(id, type) => removeTaskFromArray(id, type)}
          isDarkMode={isDarkMode}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  darkContainer: {
    backgroundColor: '#1e1e1e',
  },
  lightContainer: {
    backgroundColor: '#f5f5f5',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default AdminScreen;