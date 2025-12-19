// Machin 公式 (现有)
export function machin(digit: string, outputResult: boolean): { pi: bigint | null; iterations: number } {
  let i = 1n;
  let x = 3n * 10n ** (BigInt(digit) + 20n);
  let pi = x;
  let iterations = 0;

  while (x > 0) {
    for (let j = 0; j < 100; ++j) {
      x = (x * i) / ((i + 1n) * 4n);
      if (outputResult)
        pi += x / (i + 2n);
      i += 2n;
      iterations++;
    }
  }

  return { pi: outputResult ? pi : null, iterations };
}

// Chudnovsky 算法 (简化版)
export function chudnovsky(digit: string, outputResult: boolean): { pi: bigint | null; iterations: number } {
  const digits = BigInt(digit);
  const precision = digits + 20n;
  let sum = 0n;
  let k = 0n;
  let iterations = 0;

  // 简化的 Chudnovsky 实现
  while (k < digits / 14n + 1n) {
    const numerator = (k % 2n === 0n ? 1n : -1n) * factorial(6n * k) * (545140134n * k + 13591409n);
    const denominator = factorial(3n * k) * (factorial(k) ** 3n) * (640320n ** (3n * k));
    sum += numerator / denominator;
    k++;
    iterations++;
  }

  const pi = outputResult ? (426880n * sqrt(10005n, precision) * 10n ** precision) / sum : null;
  return { pi, iterations };
}

// BBP 算法
export function bbp(digit: string, outputResult: boolean): { pi: bigint | null; iterations: number } {
  const digits = BigInt(digit);
  let sum = 0n;
  let k = 0n;
  let iterations = 0;
  const precision = digits + 20n;

  while (k < digits) {
    const term = (1n << (precision - 4n * k)) / (8n * k + 1n)
      - (1n << (precision - 4n * k - 2n)) / (8n * k + 4n)
      - (1n << (precision - 4n * k - 3n)) / (8n * k + 5n)
      - (1n << (precision - 4n * k - 3n)) / (8n * k + 6n);
    sum += term;
    k++;
    iterations++;
  }

  return { pi: outputResult ? sum : null, iterations };
}

// 辅助函数
function factorial(n: bigint): bigint {
  if (n <= 1n)
    return 1n;
  let result = 1n;
  for (let i = 2n; i <= n; i++) {
    result *= i;
  }
  return result;
}

function sqrt(n: bigint, precision: bigint): bigint {
  let x = n;
  let y = (x + 1n) / 2n;
  while (y < x) {
    x = y;
    y = (x + n / x) / 2n;
  }
  return x * 10n ** (precision / 2n);
}
