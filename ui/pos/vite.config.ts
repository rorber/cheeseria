import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

const port = 5173;

export default defineConfig({
  plugins: [react()],
  server: {
    port,
    strictPort: true,
  },
});
