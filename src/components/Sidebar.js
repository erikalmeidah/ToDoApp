import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  Animated,
  Dimensions,
  Platform
} from 'react-native';

/**
 * Side navigation drawer for day selection
 */
const Sidebar = ({ 
  isOpen, 
  selectedDay, 
  onSelectDay,
  onClose,
  isDarkMode
}) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const screenWidth = Dimensions.get('window').width;
  
  // Animation value for sidebar position
  const translateX = new Animated.Value(isOpen ? 0 : -screenWidth);
  
  // Animate sidebar opening/closing
  React.useEffect(() => {
    Animated.timing(translateX, {
      toValue: isOpen ? 0 : -screenWidth,
      duration: 300,
      useNativeDriver: Platform.OS !== 'web', // Fix for animation on web
    }).start();
  }, [isOpen]);

  return (
    <>
      {/* Backdrop for closing sidebar when tapping outside */}
      {isOpen && (
        <TouchableOpacity 
          style={styles.backdrop} 
          activeOpacity={1} 
          onPress={onClose}
        />
      )}
      
      <Animated.View 
        style={[
          styles.sidebar,
          isDarkMode ? styles.sidebarDark : styles.sidebarLight,
          Platform.OS !== 'web' 
            ? { transform: [{ translateX }] }
            : { left: translateX } // Use left property for web
        ]}
      >
        <ScrollView contentContainerStyle={styles.dayPicker}>
          {days.map((day) => (
            <TouchableOpacity
              key={day}
              style={[
                styles.dayButton,
                selectedDay === day && styles.activeDayButton
              ]}
              onPress={() => {
                onSelectDay(day);
                onClose();
              }}
              accessibilityLabel={`Select ${day}`}
            >
              <Text style={styles.dayButtonText}>{day}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 100,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: 250,
    zIndex: 200,
    flexDirection: 'column',
    justifyContent: 'center',
    elevation: 5,
  },
  sidebarDark: {
    backgroundColor: '#2e2e2e',
  },
  sidebarLight: {
    backgroundColor: '#fff',
  },
  dayPicker: {
    padding: 25,
    alignItems: 'center',
  },
  dayButton: {
    width: 200,
    padding: 12,
    marginVertical: 5,
    backgroundColor: '#3b5998',
    borderRadius: 8,
    alignItems: 'center',
  },
  activeDayButton: {
    backgroundColor: '#1c2b4a',
    fontWeight: 'bold',
  },
  dayButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Sidebar;