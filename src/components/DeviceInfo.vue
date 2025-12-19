<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
      设备信息
    </h2>

    <div class="grid grid-cols-2 gap-4 text-gray-900 dark:text-white">
      <div class="flex items-center space-x-3">
        <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clip-rule="evenodd" />
        </svg>
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            浏览器
          </p>
          <p class="font-semibold">
            {{ deviceInfo.browser }}
          </p>
        </div>
      </div>

      <div class="flex items-center space-x-3">
        <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 7H7v6h6V7z" />
          <path fill-rule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clip-rule="evenodd" />
        </svg>
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            CPU 核心
          </p>
          <p class="font-semibold">
            {{ deviceInfo.cores || 'N/A' }}
          </p>
        </div>
      </div>

      <div class="flex items-center space-x-3">
        <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
          <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
          <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
        </svg>
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            CPU 架构
          </p>
          <p class="font-semibold">
            {{ deviceInfo.architecture }}
          </p>
        </div>
      </div>

      <div class="flex items-center space-x-3">
        <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
        </svg>
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            平台
          </p>
          <p class="font-semibold">
            {{ deviceInfo.platform }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDeviceInfo } from '../composables/useDeviceInfo';

const { deviceInfo } = useDeviceInfo();
</script>
