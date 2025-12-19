import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export interface BenchmarkResult {
  digit: string;
  spend?: string;
  result?: string;
  timestamp?: number;
  error?: boolean;
  algorithm?: string;
}

export const useBenchmarkStore = defineStore('benchmark', () => {
  const isRunning = ref(false);
  const results = ref<BenchmarkResult[]>([]);
  const currentProgress = ref(0);

  const hasResults = computed(() => results.value.length > 0);

  const addResult = (result: BenchmarkResult) => {
    const index = results.value.findIndex((r) => r.digit === result.digit);
    if (index !== -1) {
      results.value[index] = { ...results.value[index], ...result };
    } else {
      results.value.push(result);
    }
  };

  const clearResults = () => {
    results.value = [];
    currentProgress.value = 0;
  };

  const setRunning = (status: boolean) => {
    isRunning.value = status;
  };

  return {
    isRunning,
    results,
    currentProgress,
    hasResults,
    addResult,
    clearResults,
    setRunning,
  };
});
