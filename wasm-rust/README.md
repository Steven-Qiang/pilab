# Rust WASM Module for PiLab

使用 Rust + wasm-pack 实现高精度圆周率计算。

## 前置要求

1. 安装 Rust: https://rustup.rs/
2. 安装 wasm-pack: `cargo install wasm-pack`

## 构建

### Windows

```bash
cd wasm-rust
build.bat
```

### Linux/Mac

```bash
cd wasm-rust
chmod +x build.sh
./build.sh
```

### 或使用 npm

```bash
npm run build:wasm
```

## 特性

- ✅ 使用 `num-bigint` 支持任意精度整数
- ✅ 三种算法：Machin, Chudnovsky, BBP
- ✅ 编译为 WebAssembly 获得原生性能
- ✅ 与 JavaScript Worker 相同的计算逻辑

## 输出

构建后会在 `src/wasm-pkg/` 生成：

- `pilab_wasm.js` - JavaScript 绑定
- `pilab_wasm_bg.wasm` - WASM 二进制
- `pilab_wasm.d.ts` - TypeScript 类型定义
