import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  TextInput,
  Animated,
} from 'react-native';

/**
 * Manages user reminders with ability to add, toggle, and clear
 */
const Reminders = ({ reminders, onAddReminder, onToggleReminder, onClearReminders, isDarkMode }) => {
  const [reminderText, setReminderText] = useState('');
  const opacityValues = useRef({}); // Store animated values in a ref to avoid memory leaks

  // Create animated opacity value for a reminder if it doesn't exist
  const getOpacityValue = (id) => {
    if (!opacityValues.current[id]) {
      opacityValues.current[id] = new Animated.Value(1);
    }
    return opacityValues.current[id];
  };

  // Clear animation values for reminders that no longer exist
  React.useEffect(() => {
    // Get list of current reminder IDs
    const currentIds = reminders.map(r => r.id);
    
    // Clean up any stale animation values
    Object.keys(opacityValues.current).forEach(id => {
      if (!currentIds.includes(id)) {
        delete opacityValues.current[id];
      }
    });
  }, [reminders]);

  // Title case text input for consistency
  const toTitleCase = (str) => {
    return str.toLowerCase().replace(/(^|\s)\w/g, letter => letter.toUpperCase());
  };

  const handleAddReminder = () => {
    if (reminderText.trim()) {
      onAddReminder(toTitleCase(reminderText.trim()));
      setReminderText('');
    }
  };

  const handleToggleReminder = (id) => {
    const opacity = getOpacityValue(id);
    
    Animated.timing(opacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: Platform.OS !== 'web',
    }).start(() => {
      onToggleReminder(id);
      
      // Reset opacity after toggle is complete
      setTimeout(() => {
        opacity.setValue(1);
      }, 50);
    });
  };

  // Render reminders directly instead of using FlatList to avoid nesting issues
  const renderReminders = () => {
    if (!reminders || reminders.length === 0) {
      return (
        <Text style={[
          styles.emptyText,
          isDarkMode ? styles.textDark : styles.textLight
        ]}>
          No reminders
        </Text>
      );
    }

    return reminders.map(item => (
      <Animated.View 
        key={item.id}
        style={[
          styles.reminderItem,
          isDarkMode ? styles.reminderItemDark : styles.reminderItemLight,
          { opacity: getOpacityValue(item.id) }
        ]}
      >
        <TouchableOpacity
          onPress={() => handleToggleReminder(item.id)}
          style={styles.reminderTouch}
        >
          <Text 
            style={[
              isDarkMode ? styles.textDark : styles.textLight,
              item.completed && styles.completedText
            ]}
            numberOfLines={2}
          >
            {item.text}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    ));
  };

  return (
    <View style={[
      styles.container,
      isDarkMode ? styles.containerDark : styles.containerLight
    ]}>
      <Text style={[
        styles.title,
        isDarkMode ? styles.textDark : styles.textLight
      ]}>
        Reminders
      </Text>
      
      <TextInput
        style={[
          styles.input,
          isDarkMode ? styles.inputDark : styles.inputLight,
          isDarkMode ? styles.textDark : styles.textLight
        ]}
        placeholder="Add reminder"
        placeholderTextColor={isDarkMode ? '#888' : '#666'}
        value={reminderText}
        onChangeText={setReminderText}
        onSubmitEditing={handleAddReminder}
      />
      
      <TouchableOpacity
        style={[styles.button, styles.buttonPrimary, styles.addButton]}
        onPress={handleAddReminder}
      >
        <Text style={styles.buttonText}>Add Reminder</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.button, 
          styles.buttonSecondary,
          (!reminders || reminders.length === 0) && styles.disabledButton
        ]}
        onPress={onClearReminders}
        disabled={!reminders || reminders.length === 0}
      >
        <Text style={styles.buttonText}>Clear Reminders</Text>
      </TouchableOpacity>
      
      <View style={styles.remindersList}>
        {renderReminders()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 8,
    padding: 15,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  containerDark: {
    backgroundColor: '#252525',
    shadowColor: '#000',
  },
  containerLight: {
    backgroundColor: '#e0e0e0',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
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
  buttonSecondary: {
    backgroundColor: '#2a4373',
  },
  disabledButton: {
    backgroundColor: '#777',
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  remindersList: {
    width: '100%',
  },
  reminderItem: {
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  reminderItemDark: {
    backgroundColor: '#2e2e2e',
  },
  reminderItemLight: {
    backgroundColor: '#fff',
  },
  reminderTouch: {
    width: '100%',
  },
  completedText: {
    textDecorationLine: 'line-through',
    textDecorationColor: 'green',
    opacity: 0.7,
  },
  textDark: {
    color: '#e0e0e0',
  },
  textLight: {
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
  addButton: {
    marginTop: 5,
  }
});

export default Reminders;