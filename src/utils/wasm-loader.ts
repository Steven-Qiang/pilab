let wasmModule: any = null;

export async function loadWasm() {
  if (wasmModule)
    return wasmModule;

  try {
    const wasm = await import('../wasm-pkg/pilab_wasm.js');
    await wasm.default();
    wasmModule = wasm;
    return wasmModule;
  } catch (error) {
    console.error('Failed to load Rust WASM:', error);
    return null;
  }
}

export async function calculatePiWasm(digit: number, algorithm: string, outputResult: boolean): Promise<string | null> {
  const wasm = await loadWasm();
  if (!wasm)
    throw new Error('WASM not available');

  let result: string | undefined;
  switch (algorithm) {
    case 'chudnovsky':
      result = wasm.calculate_pi_chudnovsky(digit, outputResult);
      break;
    case 'bbp':
      result = wasm.calculate_pi_bbp(digit, outputResult);
      break;
    case 'machin':
    default:
      result = wasm.calculate_pi_machin(digit, outputResult);
  }

  return result || null;
}
