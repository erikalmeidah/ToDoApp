import { Platform, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

const Header = ({ toggleSidebar, openAdminModal, isDarkMode, toggleTheme }) => {
  const isAndroid = Platform.OS === 'android';
  
  return (
    <View style={[
      styles.header, 
      isDarkMode ? styles.darkHeader : styles.lightHeader,
      isAndroid && styles.androidHeader
    ]}>
      <TouchableOpacity 
        style={[styles.sandwichButton, isAndroid && styles.androidButton]} 
        onPress={toggleSidebar}
        accessibilityLabel="Toggle day picker sidebar"
      >
        <Text style={[
          styles.sandwichIcon, 
          isDarkMode ? styles.darkText : styles.lightSandwich,
          isAndroid && styles.androidIcon
        ]}>☰</Text>
      </TouchableOpacity>
      
      <Text style={[
        styles.headerTitle, 
        isDarkMode ? styles.darkText : styles.lightText,
        isAndroid && styles.androidTitle
      ]}>
        Daily To-Do List
      </Text>
      
      <View style={[styles.headerControls, isAndroid && styles.androidControls]}>
        {!isAndroid && (
          <TouchableOpacity 
            style={styles.adminButton} 
            onPress={openAdminModal}
            accessibilityLabel="Open admin settings"
          >
            <Text style={styles.adminButtonText}>Admin</Text>
          </TouchableOpacity>
        )}
        
        {isAndroid ? (
          // Simplified Android controls
          <View style={styles.androidRightControls}>
            <TouchableOpacity 
              style={styles.androidIconButton} 
              onPress={toggleTheme}
              accessibilityLabel="Toggle dark/light mode"
            >
              <Text style={isDarkMode ? styles.darkText : styles.lightText}>
                {isDarkMode ? '🌙' : '☀️'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.androidIconButton} 
              onPress={openAdminModal}
              accessibilityLabel="Open admin settings"
            >
              <Text style={isDarkMode ? styles.darkText : styles.lightText}>⚙️</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Normal theme toggle for non-Android
          <View style={styles.themeToggle}>
            <Text style={isDarkMode ? styles.darkText : styles.lightText}>
              {isDarkMode ? '🌙' : '☀️'}
            </Text>
            <Switch
              value={!isDarkMode}
              onValueChange={toggleTheme}
              thumbColor="#e0e0e0"
              trackColor={{ false: '#444', true: '#3b5998' }}
              accessibilityLabel="Toggle dark/light mode"
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 100,
  },
  androidHeader: {
    paddingVertical: 10,
    height: 56, // Material Design standard header height
    // Add this line to ensure header doesn't conflict with status bar
    marginTop: 5, // A small extra margin for Android to avoid any potential clipping
  },
  darkHeader: {
    backgroundColor: '#252525',
  },
  lightHeader: {
    backgroundColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    flexGrow: 1,
    textAlign: 'center',
    lineHeight: 36,
    margin: 0,
  },
  androidTitle: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'left',
    marginLeft: 8,
  },
  darkText: {
    color: '#e0e0e0',
  },
  lightText: {
    color: '#333',
  },
  headerControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  androidControls: {
    marginLeft: 'auto',
  },
  adminButton: {
    width: 67,
    height: 36,
    backgroundColor: '#3b5998',
    borderRadius: 8,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adminButtonText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  sandwichButton: {
    width: 67,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  androidButton: {
    width: 40,
    height: 40,
    padding: 0,
  },
  sandwichIcon: {
    fontSize: 18,
  },
  androidIcon: {
    fontSize: 16,
  },
  lightSandwich: {
    color: '#333',
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 60,
    justifyContent: 'space-between',
  },
  androidRightControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  androidIconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Header;