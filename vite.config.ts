import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Valentine-Landing-Page/',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
