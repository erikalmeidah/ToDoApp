import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  StyleSheet, 
  TextInput,
  FlatList
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { toTitleCase } from '../utils/stringHelpers';

const AdminModal = ({ 
  visible, 
  closeModal, 
  dailyTasks, 
  weeklyTasks, 
  mediaTasks,
  updateDailyTasks,
  updateWeeklyTasks,
  updateMediaTasks,
  removeTask,
  isDarkMode 
}) => {
  const [selectedArray, setSelectedArray] = useState('daily');
  const [taskText, setTaskText] = useState('');
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [currentTasks, setCurrentTasks] = useState([]);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    // Update current tasks display based on selected array
    if (selectedArray === 'daily') {
      setCurrentTasks(dailyTasks);
    } else if (selectedArray === 'weekly') {
      setCurrentTasks(weeklyTasks);
    } else {
      setCurrentTasks(mediaTasks);
    }
  }, [selectedArray, dailyTasks, weeklyTasks, mediaTasks]);

  const addTaskToArray = () => {
    if (!taskText.trim()) return;

    const newTask = {
      id: `${selectedArray[0]}${Date.now()}`,
      text: toTitleCase(taskText.trim()),
      completed: false,
      type: selectedArray,
    };

    if (selectedArray !== 'daily') {
      newTask.day = selectedDay;
    }

    if (selectedArray === 'daily') {
      updateDailyTasks([...dailyTasks, newTask]);
    } else if (selectedArray === 'weekly') {
      updateWeeklyTasks([...weeklyTasks, newTask]);
    } else {
      updateMediaTasks([...mediaTasks, newTask]);
    }

    setTaskText('');
  };

  const removeTaskFromArray = (id) => {
    removeTask(id, selectedArray);
  };

  const renderTaskItem = ({ item }) => (
    <View style={[
      styles.taskItem, 
      isDarkMode ? styles.darkTaskItem : styles.lightTaskItem
    ]}>
      <Text style={isDarkMode ? styles.darkText : styles.lightText}>
        {item.text}{item.day ? ` (${item.day})` : ''}
      </Text>
      <TouchableOpacity 
        style={styles.removeButton} 
        onPress={() => removeTaskFromArray(item.id)}
        accessibilityLabel={`Remove ${item.text}`}
      >
        <Text style={styles.removeButtonText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={closeModal}
    >
      <View style={styles.modalOverlay}>
        <View style={[
          styles.modalContent, 
          isDarkMode ? styles.darkModalContent : styles.lightModalContent
        ]}>
          <Text style={[
            styles.modalTitle, 
            isDarkMode ? styles.darkText : styles.lightText
          ]}>
            Edit Tasks
          </Text>

          {/* Updated Picker component */}
          <Picker
            selectedValue={selectedArray}
            style={[
              styles.picker, 
              isDarkMode ? styles.darkInput : styles.lightInput
            ]}
            onValueChange={(value) => setSelectedArray(value)}
            dropdownIconColor={isDarkMode ? '#e0e0e0' : '#333'}
          >
            <Picker.Item label="Daily Tasks" value="daily" />
            <Picker.Item label="Weekly Tasks" value="weekly" />
            <Picker.Item label="New Media Tasks" value="media" />
          </Picker>

          <FlatList
            data={currentTasks}
            renderItem={renderTaskItem}
            keyExtractor={item => item.id}
            style={styles.tasksList}
          />

          <TextInput
            style={[
              styles.input, 
              isDarkMode ? styles.darkInput : styles.lightInput
            ]}
            value={taskText}
            onChangeText={setTaskText}
            placeholder="New task text"
            placeholderTextColor={isDarkMode ? '#888' : '#666'}
          />

          {selectedArray !== 'daily' && (
            /* Updated Picker component */
            <Picker
              selectedValue={selectedDay}
              style={[
                styles.picker, 
                isDarkMode ? styles.darkInput : styles.lightInput
              ]}
              onValueChange={(value) => setSelectedDay(value)}
              dropdownIconColor={isDarkMode ? '#e0e0e0' : '#333'}
            >
              {days.map(day => (
                <Picker.Item key={day} label={day} value={day} />
              ))}
            </Picker>
          )}

          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={addTaskToArray}
            accessibilityLabel="Add task to array"
          >
            <Text style={styles.buttonText}>Add Task</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={closeModal}
            accessibilityLabel="Close admin modal"
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    padding: 20,
    borderRadius: 8,
    width: '80%',
    maxWidth: 500,
  },
  darkModalContent: {
    backgroundColor: '#2e2e2e',
  },
  lightModalContent: {
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  darkText: {
    color: '#e0e0e0',
  },
  lightText: {
    color: '#333',
  },
  input: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  darkInput: {
    backgroundColor: '#3e3e3e',
    color: '#e0e0e0',
    borderColor: '#444',
    borderWidth: 1,
  },
  lightInput: {
    backgroundColor: '#fff',
    color: '#333',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  picker: {
    height: 50,
    marginBottom: 10,
  },
  tasksList: {
    maxHeight: 200,
    marginBottom: 10,
  },
  taskItem: {
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  darkTaskItem: {
    backgroundColor: '#3e3e3e',
  },
  lightTaskItem: {
    backgroundColor: '#f5f5f5',
  },
  removeButton: {
    backgroundColor: '#ff4444',
    padding: 5,
    borderRadius: 4,
    minWidth: 30,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
  },
  actionButton: {
    backgroundColor: '#3b5998',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  }
});

export default AdminModal;