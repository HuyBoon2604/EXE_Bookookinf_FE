import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    watch: {
      ignored: ['**/node_modules/**'],
    },
  },
  plugins: [react()],
  server: {
    historyApiFallback: true, // Đảm bảo Vite fallback routing đúng cách
  },
});
