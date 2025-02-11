import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  server: {
    watch: {
      ignored: ['**/node_modules/**'],
    },
    historyApiFallback: true, // Gộp vào chung một object
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
