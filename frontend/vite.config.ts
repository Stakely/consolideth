import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import svgr from 'vite-plugin-svgr';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 5173,
  },
  plugins: [
    react(),
    svgr(),
    visualizer({
      filename: 'stats.html',
      template: 'treemap',
    }),
  ],
  resolve: {
    alias: {
      buffer: 'buffer',
      '@': path.resolve(__dirname, './src'),
    },
  },
});
