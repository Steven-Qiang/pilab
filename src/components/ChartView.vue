<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
      性能图表
    </h2>

    <div v-if="!hasResults" class="text-center py-12 text-gray-400 dark:text-gray-500">
      <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
      <p>完成测试后查看性能图表</p>
    </div>

    <div v-else>
      <bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
import { useBenchmarkStore } from '../stores/benchmark';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const benchmarkStore = useBenchmarkStore();
const { results, hasResults } = storeToRefs(benchmarkStore);

const chartData = computed(() => {
  const labels = results.value.map((r) => `${r.digit} 位`);
  const data = results.value.map((r) => {
    if (!r.spend || r.error)
      return 0;
    const match = r.spend.match(/[\d.]+/);
    if (!match)
      return 0;
    const value = Number.parseFloat(match[0]);
    return r.spend.includes('ms') ? value : value * 1000;
  });

  return {
    labels,
    datasets: [{
      label: '计算耗时 (ms)',
      data,
      backgroundColor: 'rgba(75, 85, 99, 0.8)',
      borderColor: 'rgba(75, 85, 99, 1)',
      borderWidth: 1,
    }],
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          const value = context.parsed.y;
          return value < 1000
            ? `${value.toFixed(2)} ms`
            : `${(value / 1000).toFixed(3)} s`;
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value: any) => {
          return value < 1000 ? `${value} ms` : `${(value / 1000).toFixed(1)} s`;
        },
      },
    },
  },
};
</script>
