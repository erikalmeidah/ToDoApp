import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity 
} from 'react-native';

/**
 * Displays completed tasks with option to clear them
 */
const CompletedTasks = ({ completedTasks, onClearCompleted, isDarkMode }) => {
  if (!completedTasks || completedTasks.length === 0) {
    return (
      <View style={[
        styles.container,
        isDarkMode ? styles.containerDark : styles.containerLight
      ]}>
        <Text style={[
          styles.title,
          isDarkMode ? styles.textDark : styles.textLight
        ]}>
          Completed Today
        </Text>
        <TouchableOpacity
          style={[styles.button, styles.buttonPrimary]}
          onPress={onClearCompleted}
          disabled={true}
        >
          <Text style={styles.buttonText}>Clear Completed Tasks</Text>
        </TouchableOpacity>
        <Text style={[
          styles.emptyText,
          isDarkMode ? styles.textDark : styles.textLight
        ]}>
          No completed tasks
        </Text>
      </View>
    );
  }

  // Render completed items directly to avoid nested VirtualizedLists
  const renderCompletedItems = () => {
    return completedTasks.map(item => (
      <View 
        key={item.id}
        style={[
          styles.completedItem,
          isDarkMode ? styles.completedItemDark : styles.completedItemLight
        ]}
      >
        <Text 
          style={[
            styles.completedText,
            isDarkMode ? styles.textDark : styles.textLight
          ]}
          numberOfLines={1}
        >
          {item.text}
        </Text>
      </View>
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
        Completed Today
      </Text>
      
      <TouchableOpacity
        style={[styles.button, styles.buttonPrimary]}
        onPress={onClearCompleted}
      >
        <Text style={styles.buttonText}>Clear Completed Tasks</Text>
      </TouchableOpacity>
      
      <View style={styles.completedList}>
        {renderCompletedItems()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
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
  completedList: {
    width: '100%',
  },
  completedItem: {
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  completedItemDark: {
    backgroundColor: '#2e2e2e',
  },
  completedItemLight: {
    backgroundColor: '#fff',
  },
  completedText: {
    textDecorationLine: 'line-through',
    textDecorationColor: 'green',
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
  }
});

export default CompletedTasks;