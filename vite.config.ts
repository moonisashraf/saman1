import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: Number(process.env.PORT) || 10000,
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
