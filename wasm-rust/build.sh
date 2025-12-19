#!/bin/bash
# Build Rust WASM module

echo "Building Rust WASM..."
wasm-pack build --target web --out-dir ../src/wasm-pkg

echo "WASM build complete!"
