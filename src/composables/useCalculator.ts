import { ref } from 'vue';
import { useBenchmarkStore } from '../stores/benchmark';
import { useHistoryStore } from '../stores/history';
import { useSettingsStore } from '../stores/settings';
import WasmWorker from '../utils/wasm-worker?worker';
import JSWorker from '../utils/worker?worker';

export function useCalculator() {
  const store = useBenchmarkStore();
  const historyStore = useHistoryStore();
  const settingsStore = useSettingsStore();
  const workers = ref<Worker[]>([]);

  const startCalculation = (digitsList: string, outputResult = false) => {
    store.clearResults();
    store.setRunning(true);

    const digits = [...new Set(digitsList.split(','))]
      .map((x) => x.trim())
      .filter((x) => x && !Number.isNaN(Number(x)))
      .sort((a, b) => Number(a) - Number(b));

    let completedCount = 0;
    const totalTasks = digits.length * (outputResult ? 2 : 1);

    digits.forEach((digit) => {
      const worker = settingsStore.computeMode === 'wasm'
        ? new WasmWorker()
        : new JSWorker();
      workers.value.push(worker);

      let hasReplayed = false;

      worker.onmessage = (msg: MessageEvent) => {
        completedCount++;

        const spend = msg.data.spend < 1000
          ? `${msg.data.spend.toFixed(2)}ms`
          : `${(msg.data.spend / 1000).toFixed(3)}s`;

        const resultData: any = {
          digit: msg.data.digit,
          timestamp: Date.now(),
          algorithm: msg.data.algorithm || settingsStore.algorithm,
        };

        if (!hasReplayed) {
          resultData.spend = spend;
        }

        if (msg.data.digits) {
          resultData.result = msg.data.digits;
        }

        store.addResult(resultData);

        store.currentProgress = Math.round((completedCount / totalTasks) * 100);

        if (!hasReplayed && outputResult) {
          worker.postMessage({
            digit,
            outputResult: true,
            algorithm: settingsStore.algorithm,
          });
          hasReplayed = true;
        } else {
          worker.terminate();
        }

        if (completedCount === totalTasks) {
          store.setRunning(false);
          workers.value = [];

          // 保存到历史记录
          historyStore.addRecord({
            id: Date.now().toString(),
            timestamp: Date.now(),
            results: JSON.parse(JSON.stringify(store.results)),
            deviceInfo: {
              browser: navigator.userAgent.includes('Chrome')
                ? 'Chrome'
                : navigator.userAgent.includes('Firefox')
                  ? 'Firefox'
                  : navigator.userAgent.includes('Safari') ? 'Safari' : 'Unknown',
              cores: navigator.hardwareConcurrency || 0,
              memory: (navigator as any).deviceMemory || 0,
              platform: navigator.platform || 'Unknown',
            },
          });
        }
      };

      worker.onerror = (error: ErrorEvent) => {
        console.error('Worker error:', error);
        completedCount++;
        store.addResult({
          digit,
          spend: 'Error',
          error: true,
        });
        worker.terminate();
      };

      worker.postMessage({
        digit,
        outputResult: false,
        algorithm: settingsStore.algorithm,
      });
    });
  };

  const stopCalculation = () => {
    workers.value.forEach((w) => w.terminate());
    workers.value = [];
    store.setRunning(false);
  };

  return {
    startCalculation,
    stopCalculation,
  };
}
