import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    watch: {
      ignored: ['**/node_modules/**'],
    },
    historyApiFallback: true, // Gộp vào chung một object
  },
  plugins: [react()],
});
