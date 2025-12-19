import { calculatePiWasm } from './wasm-loader';

interface WorkerMessage {
  digit: string;
  outputResult?: boolean;
  algorithm?: string;
}

interface WorkerResponse {
  digit: string;
  digits: string | null;
  spend: number;
  algorithm?: string;
  error?: string;
}

globalThis.onmessage = async (e: MessageEvent<WorkerMessage>) => {
  const { digit, outputResult = false, algorithm = 'machin' } = e.data;

  try {
    const startTime = performance.now();

    const result = await calculatePiWasm(Number(digit), algorithm, outputResult);

    const endTime = performance.now();
    const spend = endTime - startTime;

    const response: WorkerResponse = {
      digit,
      digits: result,
      spend,
      algorithm,
    };

    globalThis.postMessage(response);
  } catch (error) {
    globalThis.postMessage({
      digit,
      digits: null,
      spend: 0,
      algorithm,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
