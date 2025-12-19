import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export type Algorithm = 'machin' | 'chudnovsky' | 'bbp';
export type ComputeMode = 'worker' | 'wasm';

export const useSettingsStore = defineStore('settings', () => {
  const darkMode = ref(false);
  const outputResult = ref(false);
  const digits = ref('1000,5000,10000,50000,100000');
  const algorithm = ref<Algorithm>('machin');
  const computeMode = ref<ComputeMode>('worker');

  const applyTheme = () => {
    if (darkMode.value) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const initTheme = () => {
    const saved = localStorage.getItem('pilab-theme');
    if (saved) {
      darkMode.value = saved === 'dark';
    } else {
      darkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    applyTheme();
  };

  const toggleTheme = () => {
    darkMode.value = !darkMode.value;
    localStorage.setItem('pilab-theme', darkMode.value ? 'dark' : 'light');
    applyTheme();
  };

  watch([outputResult, digits, algorithm, computeMode], () => {
    localStorage.setItem('pilab-settings', JSON.stringify({
      outputResult: outputResult.value,
      digits: digits.value,
      algorithm: algorithm.value,
      computeMode: computeMode.value,
    }));
  });

  const loadSettings = () => {
    const saved = localStorage.getItem('pilab-settings');
    if (saved) {
      const settings: any = JSON.parse(saved);
      outputResult.value = settings.outputResult ?? false;
      digits.value = settings.digits ?? '1000,5000,10000,50000,100000';
      algorithm.value = settings.algorithm ?? 'machin';
      computeMode.value = settings.computeMode ?? 'worker';
    }
  };

  return {
    darkMode,
    outputResult,
    digits,
    algorithm,
    computeMode,
    initTheme,
    toggleTheme,
    loadSettings,
  };
});
