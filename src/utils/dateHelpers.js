import { DAYS } from '../constants/defaultTasks';

export const getCurrentDay = () => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date().getDay()];
};

export const getCurrentDate = () => {
  const date = new Date();
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

export const getNextDay = (day) => {
  const index = DAYS.indexOf(day);
  return DAYS[(index + 1) % 7];
};

export const isWeekend = (day) => {
  return day === 'Saturday' || day === 'Sunday';
};

export const filterTasksByDay = (allTasks, selectedDay) => {
  const isWeekendDay = isWeekend(selectedDay);
  
  const dailyTasks = allTasks.daily
    .filter(task => !(task.skipWeekends && isWeekendDay))
    .map(task => ({ ...task }));
    
  const weeklyTasks = allTasks.weekly
    .filter(task => task.day === selectedDay)
    .map(task => ({ ...task }));
    
  const mediaTasks = allTasks.media
    .filter(task => task.day === selectedDay)
    .map(task => ({ ...task }));
    
  const customTasks = allTasks.custom
    .filter(task => task.day === selectedDay && !task.completed)
    .map(task => ({ ...task, type: 'custom' }));
    
  return {
    daily: dailyTasks,
    weekly: weeklyTasks,
    media: mediaTasks,
    custom: customTasks,
    all: [...dailyTasks, ...weeklyTasks, ...mediaTasks, ...customTasks]
  };
};