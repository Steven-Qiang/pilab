import type { BenchmarkResult } from './benchmark';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export interface HistoryRecord {
  id: string;
  timestamp: number;
  results: BenchmarkResult[];
  deviceInfo: {
    browser: string;
    cores: number;
    memory: number;
    platform: string;
  };
}

export const useHistoryStore = defineStore('history', () => {
  const records = ref<HistoryRecord[]>([]);
  const maxRecords = 20;

  const loadHistory = () => {
    const saved = localStorage.getItem('pilab-history');
    if (saved) {
      records.value = JSON.parse(saved);
    }
  };

  const saveHistory = () => {
    localStorage.setItem('pilab-history', JSON.stringify(records.value));
  };

  const addRecord = (record: HistoryRecord) => {
    records.value.unshift(record);
    if (records.value.length > maxRecords) {
      records.value = records.value.slice(0, maxRecords);
    }
    saveHistory();
  };

  const deleteRecord = (id: string) => {
    records.value = records.value.filter((r) => r.id !== id);
    saveHistory();
  };

  const clearHistory = () => {
    records.value = [];
    localStorage.removeItem('pilab-history');
  };

  const hasHistory = computed(() => records.value.length > 0);

  return {
    records,
    hasHistory,
    loadHistory,
    addRecord,
    deleteRecord,
    clearHistory,
  };
});
