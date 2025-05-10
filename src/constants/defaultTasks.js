import { toTitleCase } from '../utils/stringHelpers';

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const DAILY_TASKS = [
  { id: 'daily_1', text: toTitleCase('Coffee'), completed: false, type: 'daily' },
  { id: 'daily_2', text: toTitleCase('Shower'), completed: false, type: 'daily' },
  { id: 'daily_3', text: toTitleCase('Pack Lunch'), completed: false, type: 'daily' },
  { id: 'daily_4', text: toTitleCase('Work'), completed: false, skipWeekends: true, type: 'daily' },
  { id: 'daily_5', text: toTitleCase('LUNCH'), completed: false, type: 'daily' },
  { id: 'daily_6', text: toTitleCase('Walk Mel'), completed: false, type: 'daily' },
  { id: 'daily_7', text: toTitleCase('STUDY'), completed: false, type: 'daily' },
  { id: 'daily_8', text: toTitleCase('Prepare lunch'), completed: false, type: 'daily' },
  { id: 'daily_9', text: toTitleCase('READ'), completed: false, type: 'daily' },
  { id: 'daily_10', text: toTitleCase('PRACTICE 30 MIN'), completed: false, type: 'daily' },
  { id: 'daily_11', text: toTitleCase('WORKOUT'), completed: false, type: 'daily' },
];

export const WEEKLY_TASKS = [
  { id: 'weekly_1', text: toTitleCase('Clean room'), completed: false, day: 'Sunday', type: 'weekly' },
  { id: 'weekly_2', text: toTitleCase('Shave'), completed: false, day: 'Sunday', type: 'weekly' },
];

export const NEW_MEDIA_TASKS = [
  { id: 'media_1', text: toTitleCase('Family Guy Ep'), completed: false, day: 'Monday', type: 'media' },
  { id: 'media_2', text: toTitleCase('The Studio Ep'), completed: false, day: 'Wednesday', type: 'media' },
  { id: 'media_3', text: toTitleCase('Windbreaker Ep'), completed: false, day: 'Thursday', type: 'media' },
  { id: 'media_4', text: toTitleCase('Rock is a Modesty Ep'), completed: false, day: 'Thursday', type: 'media' },
  { id: 'media_5', text: toTitleCase('Fire Force Ep'), completed: false, day: 'Friday', type: 'media' },
  { id: 'media_6', text: toTitleCase('Lazarus Ep'), completed: false, day: 'Sunday', type: 'media' },
  { id: 'media_7', text: toTitleCase('TLOU Ep'), completed: false, day: 'Sunday', type: 'media' },
];