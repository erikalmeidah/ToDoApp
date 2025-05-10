import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  SectionList,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import TaskItem from './TaskItem';
import { toTitleCase } from '../utils/stringHelpers';

/**
 * Renders lists of tasks grouped by type and provides input for adding new tasks
 */
const WebTaskList = ({ 
  dayTasks, 
  onTaskComplete, 
  onAddCustomTask, 
  onReorderTasks, 
  selectedDay,
  isDarkMode 
}) => {
  const [newTaskText, setNewTaskText] = useState('');
  const [sections, setSections] = useState([]);
  const dragDataRef = useRef({ fromGroup: null, fromIndex: null });
  
  // Update sections when dayTasks changes
  useEffect(() => {
    // Group tasks by their type
    const taskGroups = {
      daily: dayTasks.filter(task => task.type === 'daily'),
      weekly: dayTasks.filter(task => task.type === 'weekly'),
      media: dayTasks.filter(task => task.type === 'media'),
      custom: dayTasks.filter(task => task.type === 'custom'),
    };

    // Create sections for SectionList
    const updatedSections = Object.keys(taskGroups)
      .filter(key => taskGroups[key].length > 0)
      .map(key => ({
        title: `${key.charAt(0).toUpperCase() + key.slice(1)} Tasks`,
        data: taskGroups[key],
        type: key,
      }));
    
    setSections(updatedSections);
  }, [dayTasks]);

  // Set up drag-and-drop event listeners for web
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Handle drop events outside of designated drop targets
      const handleDocumentDrop = (e) => {
        // Prevent default browser behavior for drag-and-drop
        e.preventDefault();
        // Reset drag data
        dragDataRef.current = { fromGroup: null, fromIndex: null };
      };
      
      document.addEventListener('drop', handleDocumentDrop);
      document.addEventListener('dragover', (e) => e.preventDefault());
      
      return () => {
        document.removeEventListener('drop', handleDocumentDrop);
        document.removeEventListener('dragover', (e) => e.preventDefault());
      };
    }
  }, []);

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      onAddCustomTask(toTitleCase(newTaskText.trim()));
      setNewTaskText('');
    }
  };

  const handleDragStart = (groupType, index) => {
    dragDataRef.current = { fromGroup: groupType, fromIndex: index };
  };

  const handleDragOver = (e, toGroup, toIndex) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Add visual cue for drag over (could enhance with styles)
    e.currentTarget.style.borderTop = '2px solid #3b5998';
    
    return false;
  };
  
  const handleDragLeave = (e) => {
    // Remove visual cue
    e.currentTarget.style.borderTop = '';
  };

  const handleDrop = (e, toGroup, toIndex) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Remove visual cue
    e.currentTarget.style.borderTop = '';
    
    const { fromGroup, fromIndex } = dragDataRef.current;
    
    // Reset drag data
    dragDataRef.current = { fromGroup: null, fromIndex: null };
    
    // Validate drag data
    if (fromGroup === null || fromIndex === null) return;
    
    // Call reorderTasks with the validated data
    if (fromGroup === toGroup && fromIndex !== toIndex) {
      onReorderTasks(fromGroup, fromIndex, toGroup, toIndex);
    }
  };

  const renderSectionHeader = ({ section }) => (
    <Text style={[
      styles.sectionHeader,
      isDarkMode ? styles.textDark : styles.textLight
    ]}>
      {section.title}
    </Text>
  );

  const renderItem = ({ item, index, section }) => (
    <div
      style={{ width: '100%' }}
      draggable={true}
      onDragStart={() => handleDragStart(section.type, index)}
      onDragOver={(e) => handleDragOver(e, section.type, index)}
      onDragLeave={handleDragLeave}
      onDrop={(e) => handleDrop(e, section.type, index)}
    >
      <TaskItem
        key={item.id}
        task={item}
        index={index}
        groupType={section.type}
        onComplete={onTaskComplete}
        isDarkMode={isDarkMode}
      />
    </div>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.tasksContainer}>
        <Text style={[
          styles.taskHeader,
          isDarkMode ? styles.textDark : styles.textLight
        ]}>
          Tasks for {selectedDay}
        </Text>
        
        {sections.length > 0 ? (
          <SectionList
            sections={sections}
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
            keyExtractor={(item) => item.id}
            stickySectionHeadersEnabled={false}
            extraData={dayTasks} // Force re-render when dayTasks changes
          />
        ) : (
          <Text style={[
            styles.emptyText,
            isDarkMode ? styles.textDark : styles.textLight
          ]}>
            No tasks for today. Add some below!
          </Text>
        )}
        
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              isDarkMode ? styles.inputDark : styles.inputLight,
              isDarkMode ? styles.textDark : styles.textLight
            ]}
            placeholder="Add custom task"
            placeholderTextColor={isDarkMode ? '#888' : '#666'}
            value={newTaskText}
            onChangeText={setNewTaskText}
            onSubmitEditing={handleAddTask}
          />
          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary]}
            onPress={handleAddTask}
          >
            <Text style={styles.buttonText}>Add Task</Text>
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
  },
  taskHeader: {
    fontSize: 20,
    fontWeight: '500',
    marginVertical: 15,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    marginTop: 15,
  },
  inputContainer: {
    marginTop: 20,
    width: '100%',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 16,
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
  buttonPrimary: {
    backgroundColor: '#3b5998',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
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
});

export default WebTaskList;