<template>
  <div class="min-h-screen">
    <header />

    <main class="container mx-auto px-4 py-8 max-w-6xl">
      <div class="text-center mb-8">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
          现代化圆周率计算基准测试
        </h2>
        <p class="text-gray-600 dark:text-gray-400 text-lg">
          在浏览器中计算圆周率，测试设备和浏览器性能
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div class="lg:col-span-2 space-y-6">
          <benchmark-form />
          <result-table />
          <chart-view />
        </div>

        <div class="space-y-6">
          <device-info />
          <history-panel />
          <export-panel />
        </div>
      </div>

      <footer class="text-center text-gray-500 dark:text-gray-400 text-sm mt-12 pb-6">
        <p>v{{ version }} ({{ gitHash }})</p>
        <p class="mt-2">
          <a href="https://github.com/steven-qiang/pilab" target="_blank" class="hover:text-gray-900 dark:hover:text-white transition">
            GitHub
          </a>
          <span class="mx-2">|</span>
          <a href="https://qiangmou.ren" target="_blank" class="hover:text-gray-900 dark:hover:text-white transition">
            Steven-Qiang
          </a>
        </p>
      </footer>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import BenchmarkForm from './components/BenchmarkForm.vue';
import ChartView from './components/ChartView.vue';
import DeviceInfo from './components/DeviceInfo.vue';
import ExportPanel from './components/ExportPanel.vue';
import HistoryPanel from './components/HistoryPanel.vue';
import ResultTable from './components/ResultTable.vue';
import { useHistoryStore } from './stores/history';
import { useSettingsStore } from './stores/settings';

const settingsStore = useSettingsStore();
const historyStore = useHistoryStore();

const version = __APP_VERSION__;
const gitHash = __GIT_HASH__;

onMounted(() => {
  settingsStore.initTheme();
  settingsStore.loadSettings();
  historyStore.loadHistory();
});
</script>
