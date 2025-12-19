export function getAlgorithmName(algorithm?: string) {
  switch (algorithm) {
    case 'machin': return 'Machin';
    case 'chudnovsky': return 'Chudnovsky';
    case 'bbp': return 'BBP';
    default: return 'Machin';
  }
}

export function downloadResult(result: { digit: number | string; result?: string }) {
  if (!result.result)
    return;
  const blob = new Blob([result.result], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `pi-${result.digit}-${Date.now()}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}
