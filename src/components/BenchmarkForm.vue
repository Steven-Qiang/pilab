<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
      测试配置
    </h2>

    <div class="space-y-4">
      <div>
        <label class="block text-gray-700 dark:text-gray-300 mb-2">计算算法</label>
        <select
          v-model="algorithm"
          :disabled="isRunning"
          class="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
        >
          <option value="machin">
            Machin 公式（快速）
          </option>
          <option value="chudnovsky">
            Chudnovsky 算法（精确）
          </option>
          <option value="bbp">
            BBP 算法（特殊）
          </option>
        </select>
      </div>

      <div>
        <label class="block text-gray-700 dark:text-gray-300 mb-2">计算模式</label>
        <div class="flex gap-2">
          <button
            :disabled="isRunning"
            class="flex-1 py-2 px-4 rounded-lg transition"
            :class="[
              computeMode === 'worker'
                ? 'bg-gray-800 dark:bg-gray-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
            ]" @click="computeMode = 'worker'"
          >
            Web Worker
          </button>
          <button
            :disabled="isRunning"
            class="flex-1 py-2 px-4 rounded-lg transition"
            :class="[
              computeMode === 'wasm'
                ? 'bg-gray-800 dark:bg-gray-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
            ]" @click="computeMode = 'wasm'"
          >
            WebAssembly
          </button>
        </div>
      </div>

      <div>
        <label class="flex items-center space-x-2 text-gray-700 dark:text-gray-300 cursor-pointer">
          <input
            v-model="outputResult"
            type="checkbox"
            :disabled="isRunning"
            class="w-4 h-4 rounded"
          >
          <span>输出完整结果（会影响性能）</span>

        </label>
      </div>

      <div>
        <label class="block text-gray-700 dark:text-gray-300 mb-2">计算位数（逗号分隔）</label>
        <div class="flex gap-2">
          <input
            v-model="digits"
            type="text"
            :disabled="isRunning"
            placeholder="1000,5000,10000,50000,100000"
            class="flex-1 px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
          >
          <button
            :disabled="isRunning"
            class="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition text-gray-700 dark:text-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            @click="digits = '1000,5000,10000,50000,100000'"
          >
            恢复默认
          </button>
        </div>
      </div>

      <div class="flex gap-3">
        <button
          :disabled="isRunning"
          class="flex-1 py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed text-white"
          :class="isRunning ? 'bg-gray-400 dark:bg-gray-600' : 'bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600'"
          @click="handleStart"
        >
          {{ isRunning ? '计算中...' : '开始计算' }}
        </button>

        <button
          v-if="isRunning"
          class="px-6 py-3 rounded-lg font-semibold bg-red-500 hover:bg-red-600 transition text-white"
          @click="handleStop"
        >
          停止
        </button>
      </div>

      <div v-if="isRunning" class="mt-4">
        <div class="flex justify-between text-gray-700 dark:text-gray-300 text-sm mb-2">
          <span>进度</span>
          <span>{{ currentProgress }}%</span>
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            class="bg-gray-800 dark:bg-gray-400 h-full transition-all duration-300"
            :style="{ width: `${currentProgress}%` }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useCalculator } from '../composables/useCalculator';
import { useBenchmarkStore } from '../stores/benchmark';
import { useSettingsStore } from '../stores/settings';

const settingsStore = useSettingsStore();
const benchmarkStore = useBenchmarkStore();
const { outputResult, digits, algorithm, computeMode } = storeToRefs(settingsStore);
const { isRunning, currentProgress } = storeToRefs(benchmarkStore);
const { startCalculation, stopCalculation } = useCalculator();

function handleStart() {
  // 输入验证
  const digitsList = digits.value.split(',').map((x) => x.trim()).filter((x) => x);

  if (digitsList.length === 0) {
    alert('请输入要计算的位数');
    return;
  }

  const invalidDigits = digitsList.filter((x) => Number.isNaN(Number(x)) || Number(x) <= 0);
  if (invalidDigits.length > 0) {
    alert('请输入有效的正整数');
    return;
  }

  const tooLarge = digitsList.filter((x) => Number(x) > 1000000);
  if (tooLarge.length > 0) {
    if (!confirm('检测到较大的计算位数，可能需要较长时间，是否继续？')) {
      return;
    }
  }

  startCalculation(digits.value, outputResult.value);
}

function handleStop() {
  stopCalculation();
}
</script>
