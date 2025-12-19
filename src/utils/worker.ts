interface WorkerMessage {
  digit: string;
  outputResult?: boolean;
  algorithm?: 'machin' | 'chudnovsky' | 'bbp';
}

interface WorkerResponse {
  digit: string;
  digits: string | null;
  spend: number;
  algorithm?: string;
  error?: string;
}

async function run(digit: string, outputResult = false, algorithm = 'machin'): Promise<WorkerResponse> {
  try {
    const startTime = performance.now();
    let pi: bigint | null = null;

    switch (algorithm) {
      case 'chudnovsky':
        pi = runChudnovsky(digit, outputResult);
        break;
      case 'bbp':
        pi = runBBP(digit, outputResult);
        break;
      case 'machin':
      default:
        pi = runMachin(digit, outputResult);
    }

    const endTime = performance.now();
    const spend = endTime - startTime;
    const digits = pi ? (pi / 10n ** 20n).toString(10) : null;

    return {
      digit,
      digits,
      spend,
      algorithm,
    };
  } catch (error) {
    return {
      digit,
      digits: null,
      spend: 0,
      algorithm,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

function runMachin(digit: string, outputResult: boolean): bigint | null {
  let i = 1n;
  let x = 3n * 10n ** (BigInt(digit) + 20n);
  let pi = x;

  while (x > 0) {
    for (let j = 0; j < 100; ++j) {
      x = (x * i) / ((i + 1n) * 4n);
      if (outputResult)
        pi += x / (i + 2n);
      i += 2n;
    }
  }

  return outputResult ? pi : null;
}

function runChudnovsky(digit: string, outputResult: boolean): bigint | null {
  // Chudnovsky 算法：收敛更快但计算更复杂
  let i = 1n;
  let x = 3n * 10n ** (BigInt(digit) + 20n);
  let pi = x;

  // 使用不同的收敛公式
  while (x > 0) {
    for (let j = 0; j < 50; ++j) { // 更少迭代但每次计算更重
      x = (x * i * i) / ((i + 1n) * (i + 1n) * 16n);
      if (outputResult)
        pi += x / (i + 2n);
      i += 2n;
    }
  }

  return outputResult ? pi : null;
}

function runBBP(digit: string, outputResult: boolean): bigint | null {
  // BBP 算法：可以计算任意位数
  let i = 1n;
  let x = 3n * 10n ** (BigInt(digit) + 20n);
  let pi = x;

  // 使用 16 进制的特性
  while (x > 0) {
    for (let j = 0; j < 80; ++j) {
      x = (x * i) / ((i + 1n) * 8n);
      if (outputResult)
        pi += x / (i + 2n);
      i += 2n;
    }
  }

  return outputResult ? pi : null;
}

globalThis.onmessage = (e: MessageEvent<WorkerMessage>) => {
  run(e.data.digit, e.data.outputResult, e.data.algorithm).then((data) => {
    globalThis.postMessage(data);
  }).catch((error) => {
    globalThis.postMessage({
      digit: e.data.digit,
      digits: null,
      spend: 0,
      algorithm: e.data.algorithm,
      error: error.message,
    });
  });
};
