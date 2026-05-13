import { writable } from 'svelte/store';

export const MOODS = [
  { id: 'great', label: '开心', emoji: '😊', color: '#4ade80' },
  { id: 'good', label: '愉快', emoji: '😄', color: '#2dd4bf' },
  { id: 'neutral', label: '平静', emoji: '😐', color: '#94a3b8' },
  { id: 'tired', label: '疲惫', emoji: '😫', color: '#fbbf24' },
  { id: 'sad', label: '难过', emoji: '😢', color: '#60a5fa' },
  { id: 'angry', label: '生气', emoji: '😠', color: '#f87171' }
];

const STORAGE_KEY = 'mood-diary-data';

function loadFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function createDiaryStore() {
  const { subscribe, set, update } = writable(loadFromStorage());

  return {
    subscribe,
    addEntry: (date, moodId, note = '') => {
      update(entries => {
        const newEntries = { ...entries };
        newEntries[date] = { mood: moodId, note, date };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
        return newEntries;
      });
    },
    getEntry: (date) => {
      const entries = loadFromStorage();
      return entries[date];
    },
    getMonthEntries: (year, month) => {
      const entries = loadFromStorage();
      const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
      return Object.entries(entries)
        .filter(([date]) => date.startsWith(monthStr))
        .reduce((acc, [date, entry]) => {
          acc[date] = entry;
          return acc;
        }, {});
    }
  };
}

export const diaryStore = createDiaryStore();
