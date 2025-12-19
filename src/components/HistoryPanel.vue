<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
        历史记录
      </h2>
      <button
        v-if="hasHistory"
        class="text-sm text-red-500 hover:text-red-600 transition"
        @click="clearHistory"
      >
        清空
      </button>
    </div>

    <div v-if="!hasHistory" class="text-center py-8 text-gray-400 dark:text-gray-500">
      <svg class="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-sm">
        暂无历史记录
      </p>
    </div>

    <div v-else class="space-y-3 max-h-96 overflow-y-auto">
      <div
        v-for="record in records"
        :key="record.id"
        class="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
        @click="viewRecord(record)"
      >
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ formatDate(record.timestamp) }}
          </span>
          <button
            class="text-gray-400 hover:text-red-500 transition"
            @click.stop="deleteRecord(record.id)"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        <div class="text-sm text-gray-700 dark:text-gray-300">
          <div class="flex items-center gap-2 mb-1">
            <span class="font-medium">{{ record.deviceInfo.browser }}</span>
            <span class="text-gray-400">·</span>
            <span>{{ record.deviceInfo.cores }} 核</span>
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">
            {{ record.results.length }} 项测试
          </div>
          <div class="text-xs text-gray-600 dark:text-gray-400">
            位数: {{ getDigitsSummary(record.results) }}
          </div>
        </div>
      </div>
    </div>

    <!-- 弹窗 -->
    <div
      v-if="selectedRecord"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click="selectedRecord = null"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        @click.stop
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
            历史记录详情
          </h3>
          <button
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            @click="selectedRecord = null"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-500 dark:text-gray-400">浏览器:</span>
              <span class="ml-2 text-gray-900 dark:text-white">{{ selectedRecord.deviceInfo.browser }}</span>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400">CPU 核心:</span>
              <span class="ml-2 text-gray-900 dark:text-white">{{ selectedRecord.deviceInfo.cores }}</span>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400">平台:</span>
              <span class="ml-2 text-gray-900 dark:text-white">{{ selectedRecord.deviceInfo.platform }}</span>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400">时间:</span>
              <span class="ml-2 text-gray-900 dark:text-white">{{ formatDate(selectedRecord.timestamp) }}</span>
            </div>
          </div>

          <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-3">
              测试结果
            </h4>
            <div class="space-y-2">
              <div
                v-for="result in selectedRecord.results"
                :key="result.digit"
                class="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
              >
                <div>
                  <div class="text-gray-900 dark:text-white font-medium">
                    小数点后 {{ result.digit }} 位
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    {{ getAlgorithmName(result.algorithm) }}
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <div class="text-gray-900 dark:text-white font-semibold">
                    {{ result.spend }}
                  </div>
                  <button
                    v-if="result.result"
                    class="px-3 py-1 rounded bg-gray-700 dark:bg-gray-600 hover:bg-gray-800 dark:hover:bg-gray-500 transition text-sm text-white"
                    @click="downloadResult(result)"
                  >
                    下载
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HistoryRecord } from '../stores/history';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useHistoryStore } from '../stores/history';
import { downloadResult, getAlgorithmName } from '../utils/helpers';

const historyStore = useHistoryStore();
const { records, hasHistory } = storeToRefs(historyStore);
const { deleteRecord, clearHistory } = historyStore;

const selectedRecord = ref<HistoryRecord | null>(null);

function viewRecord(record: HistoryRecord) {
  selectedRecord.value = record;
}

function getDigitsSummary(results: any[]) {
  const digits = results.map((r) => r.digit).sort((a, b) => a - b);
  if (digits.length <= 3) {
    return digits.join(', ');
  }
  return `${digits[0]}, ${digits[1]}, ... ${digits[digits.length - 1]}`;
}

function formatDate(timestamp: number) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  if (diff < 60000)
    return '刚刚';
  if (diff < 3600000)
    return `${Math.floor(diff / 60000)} 分钟前`;
  if (diff < 86400000)
    return `${Math.floor(diff / 3600000)} 小时前`;

  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
</script>
