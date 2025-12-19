<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
      配置管理
    </h2>
    <div class="flex flex-col gap-3">
      <button
        class="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition text-gray-900 dark:text-white text-sm font-medium"
        @click="exportConfig"
      >
        导出配置
      </button>

      <button
        class="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition text-gray-900 dark:text-white text-sm font-medium"
        @click="triggerImport"
      >
        导入配置
      </button>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept=".json"
      class="hidden"
      @change="importConfig"
    >
  </div>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { useHistoryStore } from '../stores/history';
import { useSettingsStore } from '../stores/settings';

const settingsStore = useSettingsStore();
const historyStore = useHistoryStore();
const fileInputRef = useTemplateRef('fileInput');

function exportConfig() {
  const config = {
    version: '2.0',
    settings: {
      outputResult: settingsStore.outputResult,
      digits: settingsStore.digits,
      darkMode: settingsStore.darkMode,
    },
    history: historyStore.records,
  };

  const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `pilab-config-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function triggerImport() {
  fileInputRef.value?.click();
}

function importConfig(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file)
    return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const config = JSON.parse(e.target?.result as string);

      if (config.settings) {
        settingsStore.outputResult = config.settings.outputResult ?? false;
        settingsStore.digits = config.settings.digits ?? '1000,5000,10000,50000,100000';
        if (config.settings.darkMode !== settingsStore.darkMode) {
          settingsStore.toggleTheme();
        }
      }

      if (config.history && Array.isArray(config.history)) {
        config.history.forEach((record: any) => {
          historyStore.addRecord(record);
        });
      }

      alert('配置导入成功！');
    } catch {
      alert('配置文件格式错误！');
    }
  };
  reader.readAsText(file);
}
</script>
