import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

function getGitHash() {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch {
    return 'unknown';
  }
}

function getVersion() {
  try {
    return JSON.parse(readFileSync('./package.json', 'utf-8')).version;
  } catch {
    return '0.0.0';
  }
}

export default defineConfig({
  plugins: [vue()],
  base: process.env.NODE_ENV === 'production' ? '/pilab/' : '/',
  define: {
    __APP_VERSION__: JSON.stringify(getVersion()),
    __GIT_HASH__: JSON.stringify(getGitHash()),
  },
  build: {
    target: 'es2020',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          chart: ['chart.js', 'vue-chartjs'],
        },
      },
    },
  },
  worker: {
    format: 'es',
  },
});
