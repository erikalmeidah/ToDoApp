import { isWeekend } from './dateHelpers';
import { toTitleCase } from './stringHelpers';

export const createNewTask = (text, selectedDay, currentDate, type = 'custom') => {
  return {
    id: `c${Date.now()}`,
    text: toTitleCase(text),
    completed: false,
    day: selectedDay,
    date: currentDate,
    type,
  };
};

export const createNewReminder = (text) => {
  return {
    id: `r${Date.now()}`,
    text: toTitleCase(text),
    completed: false,
  };
};