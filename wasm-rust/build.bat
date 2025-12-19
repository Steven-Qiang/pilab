@echo off
REM Build Rust WASM module for Windows

echo Building Rust WASM...
wasm-pack build --target web --out-dir ../src/wasm-pkg

echo WASM build complete!
