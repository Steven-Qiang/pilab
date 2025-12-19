import type { HistoryRecord } from '../stores/history';
import { useBenchmarkStore } from '../stores/benchmark';
import { useHistoryStore } from '../stores/history';

export function useHistory() {
  const historyStore = useHistoryStore();
  const benchmarkStore = useBenchmarkStore();

  const saveCurrentResults = (deviceInfo: HistoryRecord['deviceInfo']) => {
    if (benchmarkStore.results.length === 0)
      return;

    const record: HistoryRecord = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      results: JSON.parse(JSON.stringify(benchmarkStore.results)),
      deviceInfo,
    };

    historyStore.addRecord(record);
  };

  return {
    saveCurrentResults,
  };
}
