import React, { useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  Animated, 
  Platform,
  View
} from 'react-native';

const TaskItem = ({ 
  task, 
  onComplete, 
  index,
  groupType,
  isDarkMode
}) => {
  const opacity = useRef(new Animated.Value(1)).current;
  
  const handlePress = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: Platform.OS !== 'web', // Fix for animation on web
    }).start(() => {
      onComplete(task.id);
    });
  };
  
  // For web - we use a div wrapper in webTaskList.js
  if (Platform.OS === 'web') {
    return (
      <Animated.View 
        style={[
          styles.taskItem,
          isDarkMode ? styles.taskItemDark : styles.taskItemLight,
          Platform.OS === 'web' ? { opacity: opacity } : { opacity }
        ]}
      >
        <TouchableOpacity 
          onPress={handlePress}
          style={styles.touchable}
        >
          <Text style={isDarkMode ? styles.textDark : styles.textLight}>
            {task.text}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }
  
  // For mobile - handled by DraggableFlatList
  return (
    <Animated.View 
      style={[
        styles.taskItem,
        isDarkMode ? styles.taskItemDark : styles.taskItemLight,
        { opacity }
      ]}
    >
      <TouchableOpacity 
        onPress={handlePress}
        style={styles.touchable}
      >
        <Text style={isDarkMode ? styles.textDark : styles.textLight}>
          {task.text}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  taskItem: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
    elevation: 3,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  taskItemDark: {
    backgroundColor: '#2e2e2e',
  },
  taskItemLight: {
    backgroundColor: '#fff',
  },
  textDark: {
    color: '#e0e0e0',
  },
  textLight: {
    color: '#333',
  },
  touchable: {
    width: '100%',
    height: '100%',
  }
});

export default TaskItem;