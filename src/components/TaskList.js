import { Platform } from 'react-native';
import SimpleMobileTaskList from './MobileTaskList'; // Updated to uppercase 'M' and 'T'
import WebTaskList from './WebTaskList'; // Updated to uppercase 'W' and 'T'

/**
 * Platform-aware TaskList component that chooses the appropriate implementation
 * based on whether the app is running on web or mobile
 */
const TaskList = (props) => {
  if (Platform.OS === 'web') {
    return <WebTaskList {...props} />;
  } else {
    return <SimpleMobileTaskList {...props} />;
  }
};

export default TaskList;