<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
      测试结果
    </h2>

    <div v-if="!hasResults" class="text-center py-12 text-gray-400 dark:text-gray-500">
      <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p>暂无测试结果，点击"开始计算"进行测试</p>
    </div>

    <div v-else class="overflow-x-auto">
      <table class="w-full text-gray-900 dark:text-white table-fixed">
        <colgroup>
          <col :class="hasResultData ? 'w-2/5' : 'w-1/3'">
          <col :class="hasResultData ? 'w-1/5' : 'w-1/3'">
          <col :class="hasResultData ? 'w-1/5' : 'w-1/3'">
          <col v-if="hasResultData" class="w-1/5">
        </colgroup>
        <thead>
          <tr class="border-b border-gray-200 dark:border-gray-700">
            <th class="text-left py-3 px-4">
              计算位数
            </th>
            <th class="text-left py-3 px-4">
              算法
            </th>
            <th class="text-left py-3 px-4">
              耗时
            </th>
            <th v-if="hasResultData" class="text-center py-3 px-4">
              操作
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in results"
            :key="item.digit"
            class="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
          >
            <td class="py-3 px-4">
              小数点后 {{ item.digit }} 位
            </td>
            <td class="py-3 px-4">
              <span class="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700">
                {{ getAlgorithmName(item.algorithm) }}
              </span>
            </td>
            <td class="py-3 px-4">
              <span v-if="item.spend" :class="item.error ? 'text-red-500' : ''">
                {{ item.spend }}
              </span>
              <span v-else class="text-gray-400 dark:text-gray-500">计算中...</span>
            </td>
            <td v-if="hasResultData" class="py-3 px-4 text-center">
              <button
                v-if="item.result"
                class="px-3 py-1 rounded bg-gray-700 dark:bg-gray-600 hover:bg-gray-800 dark:hover:bg-gray-500 transition text-sm text-white"
                @click="downloadResult(item)"
              >
                下载结果
              </button>
              <span v-else class="text-gray-400 dark:text-gray-500 text-sm">计算中...</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useBenchmarkStore } from '../stores/benchmark';
import { downloadResult, getAlgorithmName } from '../utils/helpers';

const benchmarkStore = useBenchmarkStore();
const { results, hasResults } = storeToRefs(benchmarkStore);

const hasResultData = computed(() => results.value.some((r) => r.result));
</script>
