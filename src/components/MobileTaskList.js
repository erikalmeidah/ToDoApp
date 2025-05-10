import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import { toTitleCase } from '../utils/stringHelpers';
import CompletedTasks from './CompletedTasks';
import Reminders from './Reminders';

/**
 * TaskItem component for the DraggableFlatList
 */
const DraggableTaskItem = ({ 
  item, 
  drag, 
  isActive, 
  onComplete,
  isDarkMode 
}) => {
  const isAndroid = Platform.OS === 'android';
  
  return (
    <ScaleDecorator>
      <TouchableOpacity
        onLongPress={drag}
        onPress={() => onComplete(item.id)}
        disabled={isActive}
        style={[
          styles.taskItem,
          isDarkMode ? styles.taskItemDark : styles.taskItemLight,
          isActive && styles.taskItemActive,
          isAndroid && styles.androidTaskItem
        ]}
        activeOpacity={0.7}
      >
        <Text style={[
          isDarkMode ? styles.textDark : styles.textLight,
          isAndroid && styles.androidTaskText
        ]}>
          {item.text}
        </Text>
      </TouchableOpacity>
    </ScaleDecorator>
  );
};

/**
 * Mobile-optimized TaskList using react-native-draggable-flatlist
 */
const MobileTaskList = ({ 
  dayTasks, 
  onTaskComplete, 
  onAddCustomTask, 
  onReorderTasks, 
  selectedDay,
  isDarkMode,
  completedTasksProps,
  remindersProps
}) => {
  const [newTaskText, setNewTaskText] = useState('');
  const [flattenedTasks, setFlattenedTasks] = useState([]);
  const isAndroid = Platform.OS === 'android';

  // Transform task groups into a single array with section headers
  useEffect(() => {
    const tasksByType = {
      daily: dayTasks.filter(task => task.type === 'daily'),
      weekly: dayTasks.filter(task => task.type === 'weekly'),
      media: dayTasks.filter(task => task.type === 'media'),
      custom: dayTasks.filter(task => task.type === 'custom'),
    };

    const newFlattenedTasks = [];
    
    // Add sections and items
    Object.entries(tasksByType).forEach(([type, tasks]) => {
      if (tasks.length > 0) {
        // Add a section header item
        newFlattenedTasks.push({
          id: `section_${type}`,
          isSection: true,
          text: `${type.charAt(0).toUpperCase() + type.slice(1)} Tasks`,
          type
        });
        
        // Add the tasks
        tasks.forEach(task => {
          newFlattenedTasks.push({
            ...task,
            isSection: false
          });
        });
      }
    });
    
    setFlattenedTasks(newFlattenedTasks);
  }, [dayTasks]);

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      onAddCustomTask(toTitleCase(newTaskText.trim()));
      setNewTaskText('');
    }
  };

  // Render a section header or task item
  const renderItem = ({ item, drag, isActive }) => {
    if (item.isSection) {
      return (
        <View style={[styles.sectionHeader, isAndroid && styles.androidSectionHeader]}>
          <Text style={[
            styles.sectionHeaderText,
            isDarkMode ? styles.textDark : styles.textLight,
            isAndroid && styles.androidSectionHeaderText
          ]}>
            {item.text}
          </Text>
        </View>
      );
    }
    
    return (
      <DraggableTaskItem
        item={item}
        drag={drag}
        isActive={isActive}
        onComplete={onTaskComplete}
        isDarkMode={isDarkMode}
      />
    );
  };

  // Create a footer component that includes CompletedTasks and Reminders
  const renderListFooter = () => (
    <View style={styles.footerContainer}>
      {completedTasksProps && <CompletedTasks {...completedTasksProps} />}
      {remindersProps && <Reminders {...remindersProps} />}
      
      {/* Add empty view with extra padding to ensure everything is visible */}
      <View style={styles.extraPadding} />
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
      style={styles.container}
    >
      <View style={[styles.tasksContainer, isAndroid && styles.androidTasksContainer]}>
        <Text style={[
          styles.taskHeader,
          isDarkMode ? styles.textDark : styles.textLight,
          isAndroid && styles.androidTaskHeader
        ]}>
          Tasks for {selectedDay}
        </Text>
        
        {flattenedTasks.length > 0 ? (
          <DraggableFlatList
            data={flattenedTasks}
            keyExtractor={(item) => item.id}
            onDragEnd={({ from, to, data }) => {
              // Only handle reordering for non-section items
              if (!data[from].isSection && !data[to].isSection) {
                // Find the group type for these items
                const fromType = data[from].type;
                const toType = data[to].type;
                
                // If same type, calculate indices within that type
                if (fromType === toType) {
                  // Find all indices of items with this type
                  const typeIndices = data
                    .map((item, idx) => item.type === fromType && !item.isSection ? idx : -1)
                    .filter(idx => idx !== -1);
                  
                  // Find position within the filtered array
                  const fromTypeIndex = typeIndices.indexOf(from);
                  const toTypeIndex = typeIndices.indexOf(to);
                  
                  // Call reorderTasks with type-specific indices
                  onReorderTasks(fromType, fromTypeIndex, toType, toTypeIndex);
                }
              }
            }}
            renderItem={renderItem}
            containerStyle={styles.draggableList}
            contentContainerStyle={styles.listContentContainer}
            ListFooterComponent={renderListFooter}
          />
        ) : (
          <View>
            <Text style={[
              styles.emptyText,
              isDarkMode ? styles.textDark : styles.textLight
            ]}>
              No tasks for today. Add some below!
            </Text>
            {renderListFooter()}
          </View>
        )}
        
        <View style={[styles.inputContainer, isAndroid && styles.androidInputContainer]}>
          <TextInput
            style={[
              styles.input,
              isDarkMode ? styles.inputDark : styles.inputLight,
              isDarkMode ? styles.textDark : styles.textLight,
              isAndroid && styles.androidInput
            ]}
            placeholder="Add custom task"
            placeholderTextColor={isDarkMode ? '#888' : '#666'}
            value={newTaskText}
            onChangeText={setNewTaskText}
            onSubmitEditing={handleAddTask}
          />
          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary, isAndroid && styles.androidButton]}
            onPress={handleAddTask}
          >
            <Text style={[styles.buttonText, isAndroid && styles.androidButtonText]}>Add Task</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  tasksContainer: {
    width: '100%',
    maxWidth: 650,
    alignSelf: 'center',
    paddingHorizontal: 15,
  },
  androidTasksContainer: {
    paddingHorizontal: 10,
  },
  taskHeader: {
    fontSize: 20,
    fontWeight: '500',
    marginVertical: 15,
  },
  androidTaskHeader: {
    fontSize: 18,
    marginVertical: 10,
  },
  sectionHeader: {
    padding: 10,
    borderRadius: 4,
    marginBottom: 5,
    marginTop: 10,
  },
  androidSectionHeader: {
    padding: 6,
    marginBottom: 2,
    marginTop: 8,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: '500',
  },
  androidSectionHeaderText: {
    fontSize: 14,
  },
  draggableList: {
    width: '100%',
  },
  listContentContainer: {
    paddingBottom: 30, // Add padding to the list content
  },
  taskItem: {
    padding: 15,
    borderRadius: 8,
    marginVertical: 4,
    elevation: 3,
    width: '100%',
  },
  androidTaskItem: {
    padding: 10,
    marginVertical: 2,
    elevation: 1,
    borderRadius: 4,
  },
  taskItemDark: {
    backgroundColor: '#2e2e2e',
  },
  taskItemLight: {
    backgroundColor: '#fff',
  },
  androidTaskText: {
    fontSize: 14,
  },
  taskItemActive: {
    transform: [{ scale: 1.05 }],
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    zIndex: 999,
  },
  inputContainer: {
    marginTop: 20,
    width: '100%',
    marginBottom: 30,
  },
  androidInputContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 16,
  },
  androidInput: {
    padding: 8,
    borderRadius: 4,
    fontSize: 14,
    marginBottom: 6,
  },
  inputDark: {
    backgroundColor: '#3e3e3e',
    borderColor: '#444',
  },
  inputLight: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
  },
  button: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  androidButton: {
    padding: 8,
    borderRadius: 4,
  },
  buttonPrimary: {
    backgroundColor: '#3b5998',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  androidButtonText: {
    fontSize: 14,
  },
  textDark: {
    color: '#e0e0e0',
  },
  textLight: {
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 30,
    marginBottom: 30,
    fontStyle: 'italic',
  },
  footerContainer: {
    marginTop: 20,
    paddingBottom: 50, // Increased from 30 to 50
    width: '100%',
  },
  extraPadding: {
    height: 100, // Add extra padding at the bottom
  }
});

export default MobileTaskList;